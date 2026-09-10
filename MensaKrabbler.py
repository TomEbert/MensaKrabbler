from __future__ import annotations

import datetime as dt
import json
import re
import time
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable
from zoneinfo import ZoneInfo

import pandas as pd
import requests
from bs4 import BeautifulSoup


SOURCE_URL = "https://sws2.maxmanager.xyz/inc/ajax-php_konnektor.inc.php"
SOURCE_REFERER = "https://sws2.maxmanager.xyz/index.php?mode=bed"
TIMEZONE = ZoneInfo("Europe/Berlin")


class Weekday:
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4

    weekdays = [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY]


WEEKDAY_NAMES = {
    0: "Montag",
    1: "Dienstag",
    2: "Mittwoch",
    3: "Donnerstag",
    4: "Freitag",
}


@dataclass(frozen=True)
class Location:
    id: str
    name: str
    loc_id: int


LOCATIONS = {
    "vaihingen": Location("vaihingen", "Mensa Vaihingen", 2),
    "central": Location("central", "Mensa Central", 16),
}


@dataclass
class Meal:
    name: str
    category: str | None
    subcategory: str | None
    image: str | None
    labels: list[str]
    is_vegan: bool
    is_vegetarian: bool
    student_price: float | None
    employee_price: float | None
    guest_price: float | None
    co2_per_portion_g: float | None
    co2_per_100g_g: float | None
    energy_kj_per_100g: float | None
    kcal_per_100g: float | None
    fat_g_per_100g: float | None
    saturated_fat_g_per_100g: float | None
    carbohydrates_g_per_100g: float | None
    sugar_g_per_100g: float | None
    protein_g_per_100g: float | None
    salt_g_per_100g: float | None
    kcal_per_euro: float | None
    protein_per_euro: float | None
    is_side: bool


@dataclass
class DayMenu:
    date: str
    weekday: str
    status: str
    message: str | None
    meals: list[Meal]


@dataclass
class LocationMenu:
    id: str
    name: str
    source_loc_id: int
    days: list[DayMenu]


def week_dates(today: dt.date | None = None) -> list[dt.date]:
    today = today or dt.datetime.now(TIMEZONE).date()
    monday = today - dt.timedelta(days=today.weekday())
    dates = [monday + dt.timedelta(days=offset) for offset in range(5)]
    return [date + dt.timedelta(days=7) if date < today else date for date in dates]


def _parse_decimal(value: str | None) -> float | None:
    if not value:
        return None
    match = re.search(r"-?\d+(?:[.,]\d+)?", value)
    if not match:
        return None
    return float(match.group(0).replace(",", "."))


def _money_from_text(text: str, label: str) -> float | None:
    normalized = text.replace("€", "EUR").replace("\xa0", " ")
    pattern = rf"{label}\s*\|\s*([0-9]+(?:[,.][0-9]{{1,2}})?)\s*EUR"
    match = re.search(pattern, normalized, flags=re.IGNORECASE)
    return _parse_decimal(match.group(1)) if match else None


def _prices_from_text(text: str) -> tuple[float | None, float | None, float | None]:
    normalized = text.replace("\xa0", " ")
    labelled = (
        _money_from_text(normalized, "STUDIS"),
        _money_from_text(normalized, "BEDIENSTETE"),
        _money_from_text(normalized, "GÄSTE"),
    )
    if any(value is not None for value in labelled):
        return labelled

    match = re.search(
        r"€\s*([0-9]+(?:[,.][0-9]{1,2})?)\s*/\s*([0-9]+(?:[,.][0-9]{1,2})?)\s*/\s*([0-9]+(?:[,.][0-9]{1,2})?)",
        normalized,
    )
    if not match:
        return None, None, None
    return tuple(_parse_decimal(value) for value in match.groups())


def _nutrition_number(text: str, label: str) -> float | None:
    pattern = rf"{re.escape(label)}\s*([0-9]+(?:[,.][0-9]+)?)"
    match = re.search(pattern, text, flags=re.IGNORECASE)
    return _parse_decimal(match.group(1)) if match else None


def _energy(text: str) -> tuple[float | None, float | None]:
    match = re.search(
        r"Brennwert:\s*([0-9]+(?:[,.][0-9]+)?)\s*kj\s*/\s*([0-9]+(?:[,.][0-9]+)?)\s*kcal",
        text,
        flags=re.IGNORECASE,
    )
    if not match:
        return None, _nutrition_number(text, "Brennwert:")
    return _parse_decimal(match.group(1)), _parse_decimal(match.group(2))


def _rounded_ratio(numerator: float | None, denominator: float | None) -> float | None:
    if numerator is None or denominator in (None, 0):
        return None
    return round(numerator / denominator, 1)


def _clean_text(element) -> str:
    return " ".join(element.get_text(" ", strip=True).split())


def _extract_labels(meal_row) -> list[str]:
    labels: list[str] = []
    for element in meal_row.find_all(["img", "span"]):
        label = element.get("title") or element.get("alt")
        if label and label.strip() and label.strip() not in labels:
            labels.append(label.strip())
    return labels


def _extract_name(meal_row) -> str:
    for selector in [".mealText span", ".splMealText span", ".col-md-8 span", "span"]:
        element = meal_row.select_one(selector)
        if element:
            name = _clean_text(element)
            if name:
                return name
    return _clean_text(meal_row)


def _extract_image(meal_row) -> str | None:
    images = meal_row.find_all("img")
    for image in images:
        source = image.get("src")
        description = f"{image.get('alt', '')} {image.get('title', '')}".lower()
        if source and ("essensfoto" in description or "speisefoto" in description or "speisefotos" in source.lower()):
            return source
    return None


def _parse_meal(meal_row, category: str | None, subcategory: str | None) -> Meal:
    text = _clean_text(meal_row)
    labels = _extract_labels(meal_row)
    lower_labels = " ".join(labels).lower()
    lower_category = (category or "").lower()
    student_price, employee_price, guest_price = _prices_from_text(text)
    energy_kj, kcal = _energy(text)
    protein = _nutrition_number(text, "Eiweiß:")

    image = _extract_image(meal_row)

    is_vegan = "vegan" in lower_labels
    is_vegetarian = is_vegan or "vegetar" in lower_labels

    return Meal(
        name=_extract_name(meal_row),
        category=category.split(" PREIS ", 1)[0].title() if category else None,
        subcategory=subcategory,
        image=image,
        labels=labels,
        is_vegan=is_vegan,
        is_vegetarian=is_vegetarian,
        student_price=student_price,
        employee_price=employee_price,
        guest_price=guest_price,
        co2_per_portion_g=_nutrition_number(text, "CO2 pro Portion"),
        co2_per_100g_g=_nutrition_number(text, "CO2 pro 100 g"),
        energy_kj_per_100g=energy_kj,
        kcal_per_100g=kcal,
        fat_g_per_100g=_nutrition_number(text, "Fett:"),
        saturated_fat_g_per_100g=_nutrition_number(text, "davon ges. FS:"),
        carbohydrates_g_per_100g=_nutrition_number(text, "Kohlenhydrate:"),
        sugar_g_per_100g=_nutrition_number(text, "davon Zucker:"),
        protein_g_per_100g=protein,
        salt_g_per_100g=_nutrition_number(text, "Salz:"),
        kcal_per_euro=_rounded_ratio(kcal, student_price),
        protein_per_euro=_rounded_ratio(protein, student_price),
        is_side="beilage" in lower_category,
    )


def parse_menu_html(html: str, date: dt.date) -> DayMenu:
    soup = BeautifulSoup(html, "html.parser")
    rows = soup.select(".row")
    meals: list[Meal] = []
    category: str | None = None
    subcategory: str | None = None

    for row in rows:
        classes = set(row.get("class", []))
        if "gruppenkopf" in classes:
            category = _clean_text(row)
            subcategory = None
        elif "untergruppenkopf" in classes:
            subcategory = _clean_text(row)
        elif "splMeal" in classes:
            meals.append(_parse_meal(row, category, subcategory))

    weekday = WEEKDAY_NAMES.get(date.weekday(), date.strftime("%A"))
    page_text = _clean_text(soup).lower()
    if meals:
        return DayMenu(date.isoformat(), weekday, "open", None, meals)
    if "geschlossen" in page_text or "keine speisen" in page_text or "nodata" in html:
        return DayMenu(date.isoformat(), weekday, "closed", "Die Mensa hat an diesem Tag geschlossen.", [])
    raise ValueError(f"Keine Gerichte und kein erkannter Schließzustand für {date.isoformat()}.")


def fetch_menu_html(
    location: Location,
    date: dt.date,
    session: requests.Session | None = None,
    attempts: int = 3,
    timeout: int = 15,
) -> str:
    session = session or requests.Session()
    monday = date - dt.timedelta(days=date.weekday())
    payload = {
        "func": "make_spl",
        "locId": str(location.loc_id),
        "date": date.isoformat(),
        "lang": "de",
        "startThisWeek": monday.isoformat(),
        "startNextWeek": (monday + dt.timedelta(days=7)).isoformat(),
    }
    headers = {
        "Origin": "https://sws2.maxmanager.xyz",
        "Referer": SOURCE_REFERER,
        "X-Requested-With": "XMLHttpRequest",
    }
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        try:
            response = session.post(SOURCE_URL, data=payload, headers=headers, timeout=timeout)
            response.raise_for_status()
            if not response.text.strip():
                raise ValueError("Leere Antwort vom Speiseplan-Server.")
            return response.text
        except (requests.RequestException, ValueError) as error:
            last_error = error
            if attempt < attempts:
                time.sleep(1.5 * attempt)
    raise RuntimeError(f"Abruf fehlgeschlagen für {location.name} am {date.isoformat()}: {last_error}")


def fetch_day_menu(location: Location, date: dt.date, session: requests.Session | None = None) -> DayMenu:
    return parse_menu_html(fetch_menu_html(location, date, session=session), date)


def fetch_week_menus(
    location_ids: Iterable[str] = ("vaihingen", "central"),
    today: dt.date | None = None,
) -> dict:
    fetched_at = dt.datetime.now(TIMEZONE).replace(microsecond=0).isoformat()
    dates = week_dates(today)
    session = requests.Session()
    locations = []
    for location_id in location_ids:
        location = LOCATIONS[location_id]
        days = [fetch_day_menu(location, date, session=session) for date in dates]
        locations.append(LocationMenu(location.id, location.name, location.loc_id, days))
    return {
        "generated_at": fetched_at,
        "timezone": "Europe/Berlin",
        "source": SOURCE_REFERER,
        "locations": [asdict(location) for location in locations],
    }


def validate_menu_data(data: dict) -> None:
    location_ids = {location["id"] for location in data.get("locations", [])}
    expected_location_ids = set(LOCATIONS)
    if location_ids != expected_location_ids:
        raise ValueError(f"Standorte unvollständig: {location_ids} statt {expected_location_ids}.")

    for location in data["locations"]:
        days = location.get("days", [])
        if len(days) != 5:
            raise ValueError(f"{location['name']} enthält {len(days)} statt 5 Tage.")
        for day in days:
            meals = day.get("meals", [])
            if day.get("status") == "open" and not meals:
                raise ValueError(f"{location['name']} am {day['date']} ist offen, enthält aber keine Gerichte.")
            missing_prices = [meal["name"] for meal in meals if meal.get("student_price") is None]
            if missing_prices:
                names = ", ".join(missing_prices[:3])
                raise ValueError(f"{location['name']} am {day['date']} hat Gerichte ohne Studierendenpreis: {names}.")


def write_week_json(output_path: str | Path = "Website/data/menu.json") -> dict:
    data = fetch_week_menus()
    validate_menu_data(data)
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return data


def _day_dataframe(day: DayMenu) -> pd.DataFrame:
    records = [
        {
            "Name": meal.name,
            "Kategorie": meal.category,
            "Preis": meal.student_price,
            "Vegan": meal.is_vegan,
            "Vegetarisch": meal.is_vegetarian,
            "Brennwert": meal.kcal_per_100g,
            "Eiweiß": meal.protein_g_per_100g,
            "Fett": meal.fat_g_per_100g,
            "Kohlenhydrate": meal.carbohydrates_g_per_100g,
            "Salz": meal.salt_g_per_100g,
            "Brennwert pro Preis": meal.kcal_per_euro,
            "Eiweiß pro Preis": meal.protein_per_euro,
        }
        for meal in day.meals
    ]
    df = pd.DataFrame(records)
    if not df.empty:
        df = df.sort_values(
            by=["Eiweiß pro Preis", "Brennwert pro Preis"],
            ascending=False,
            na_position="last",
        )
        low_price = df["Preis"].fillna(99) <= 1.5
        df = pd.concat([df[~low_price], df[low_price]])
    return df


def run(weekday: Weekday, ShouldReturnDataFrame: bool, location_id: str = "vaihingen"):
    dates = week_dates()
    date = dates[int(weekday)]
    location = LOCATIONS[location_id]
    day = fetch_day_menu(location, date)
    df = _day_dataframe(day)
    headline = f"Empfehlungen für {location.name} am {day.weekday}, {date.strftime('%d.%m.%Y')}"
    if ShouldReturnDataFrame:
        return df.rename(columns={"Name": headline}) if not df.empty else df
    return headline + "\n" + df.to_string(index=False)


if __name__ == "__main__":
    write_week_json()
