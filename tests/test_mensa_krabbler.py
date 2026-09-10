import datetime as dt
from dataclasses import asdict
from pathlib import Path

import pytest

import MensaKrabbler


FIXTURES = Path(__file__).parent / "fixtures"


def test_week_dates_move_past_days_to_the_following_week():
    assert MensaKrabbler.week_dates(dt.date(2026, 9, 10))[0] == dt.date(2026, 9, 14)
    assert MensaKrabbler.week_dates(dt.date(2026, 9, 10))[2] == dt.date(2026, 9, 16)
    assert MensaKrabbler.week_dates(dt.date(2026, 9, 10))[-1] == dt.date(2026, 9, 11)


def test_week_dates_use_next_week_on_weekends():
    assert MensaKrabbler.week_dates(dt.date(2026, 9, 12))[0] == dt.date(2026, 9, 14)
    assert MensaKrabbler.week_dates(dt.date(2026, 9, 13))[0] == dt.date(2026, 9, 14)


def test_parse_open_day_extracts_prices_nutrients_ratios_and_side():
    html = (FIXTURES / "open_day.html").read_text(encoding="utf-8")
    menu = MensaKrabbler.parse_menu_html(html, dt.date(2026, 9, 10))

    assert menu.status == "open"
    assert len(menu.meals) == 2
    meal = menu.meals[0]
    assert meal.name == "Spaghetti aglio e olio"
    assert meal.image == "assets/fotos/mensa/spaghetti.jpg?v=1"
    assert meal.student_price == 2.99
    assert meal.employee_price == 4.2
    assert meal.guest_price == 5.1
    assert meal.is_vegan is True
    assert meal.kcal_per_100g == 148
    assert meal.protein_g_per_100g == 6.4
    assert meal.kcal_per_euro == 49.5
    assert meal.protein_per_euro == 2.1
    assert menu.meals[1].is_side is True


def test_parse_closed_day_is_valid_empty_menu():
    html = (FIXTURES / "closed_day.html").read_text(encoding="utf-8")
    menu = MensaKrabbler.parse_menu_html(html, dt.date(2026, 9, 12))

    assert menu.status == "closed"
    assert menu.meals == []


def test_unknown_empty_html_fails():
    with pytest.raises(ValueError):
        MensaKrabbler.parse_menu_html("<div>Wartung</div>", dt.date(2026, 9, 10))


def test_validate_menu_data_rejects_missing_prices():
    html = (FIXTURES / "open_day.html").read_text(encoding="utf-8")
    day = MensaKrabbler.parse_menu_html(html, dt.date(2026, 9, 10))
    day.meals[0].student_price = None
    data = {
        "locations": [
            {"id": "vaihingen", "name": "Mensa Vaihingen", "days": [asdict(day)] * 5},
            {"id": "central", "name": "Mensa Central", "days": [asdict(day)] * 5},
        ]
    }

    with pytest.raises(ValueError, match="ohne Studierendenpreis"):
        MensaKrabbler.validate_menu_data(data)
