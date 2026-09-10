const state = {
  data: null,
  locationId: localStorage.getItem("mensa-location") || "vaihingen",
  dayIndex: 0,
  filter: "all",
  sort: "protein_per_euro",
};

const fullDate = new Intl.DateTimeFormat("de-DE", {
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

document.addEventListener("DOMContentLoaded", async () => {
  bindControls();
  try {
    const response = await fetch("Website/data/menu.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    state.data = await response.json();
    initialiseDay();
    render();
  } catch (error) {
    showLoadError(error);
  }
});

function bindControls() {
  document.getElementById("location-select").addEventListener("change", (event) => {
    state.locationId = event.target.value;
    localStorage.setItem("mensa-location", state.locationId);
    render();
  });
  document.getElementById("diet-filter").addEventListener("change", (event) => {
    state.filter = event.target.value;
    render();
  });
  document.getElementById("sort-select").addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });
}

function initialiseDay() {
  const today = new Date().toISOString().slice(0, 10);
  const todayIndex = currentLocation().days.findIndex((day) => day.date === today);
  state.dayIndex = todayIndex >= 0 ? todayIndex : Math.min(new Date().getDay() - 1, 4);
  if (state.dayIndex < 0) {
    state.dayIndex = 4;
  }
}

function currentLocation() {
  return state.data.locations.find((location) => location.id === state.locationId) || state.data.locations[0];
}

function render() {
  renderFreshness();
  renderLocationSelect();
  renderDayTabs();
  renderMeals();
}

function renderFreshness() {
  const freshness = document.getElementById("freshness");
  const generatedAt = new Date(state.data.generated_at);
  const ageHours = (Date.now() - generatedAt.getTime()) / 36e5;
  freshness.classList.toggle("stale", ageHours > 36);
  freshness.textContent = ageHours > 36
    ? `Datenstand veraltet: ${fullDate.format(generatedAt)}`
    : `Aktualisiert: ${fullDate.format(generatedAt)}`;
}

function renderLocationSelect() {
  const select = document.getElementById("location-select");
  select.innerHTML = "";
  state.data.locations.forEach((location) => {
    const option = document.createElement("option");
    option.value = location.id;
    option.textContent = location.name;
    option.selected = location.id === state.locationId;
    select.append(option);
  });
}

function renderDayTabs() {
  const tabs = document.getElementById("day-tabs");
  const today = new Date().toISOString().slice(0, 10);
  tabs.innerHTML = "";
  currentLocation().days.forEach((day, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab-button";
    button.role = "tab";
    button.setAttribute("aria-selected", String(index === state.dayIndex));
    button.textContent = `${day.weekday.slice(0, 2)} ${shortDate(day.date)}`;
    if (day.date === today) {
      button.dataset.today = "true";
      button.title = "Heute";
    }
    button.addEventListener("click", () => {
      state.dayIndex = index;
      render();
    });
    tabs.append(button);
  });
}

function renderMeals() {
  const grid = document.getElementById("meal-grid");
  const status = document.getElementById("day-status");
  const day = currentLocation().days[state.dayIndex];
  const meals = sortMeals(filterMeals(day.meals || []));
  grid.innerHTML = "";

  const heading = `${currentLocation().name}, ${fullDate.format(localDate(day.date))}`;
  if (day.status === "closed") {
    status.hidden = false;
    status.textContent = `${heading}: ${day.message || "geschlossen"}`;
    return;
  }
  if (meals.length === 0) {
    status.hidden = false;
    status.textContent = `${heading}: Keine Gerichte passen zu deinem Filter.`;
    return;
  }

  status.hidden = false;
  status.textContent = `${heading}: ${meals.length} Gerichte`;
  meals.forEach((meal) => grid.append(renderMealCard(meal)));
}

function filterMeals(meals) {
  if (state.filter === "vegan") {
    return meals.filter((meal) => meal.is_vegan);
  }
  if (state.filter === "vegetarian") {
    return meals.filter((meal) => meal.is_vegetarian);
  }
  return meals;
}

function sortMeals(meals) {
  const sorters = {
    protein_per_euro: [(meal) => meal.protein_per_euro, "desc", (meal) => meal.student_price, "asc"],
    protein: [(meal) => meal.protein_g_per_100g, "desc", (meal) => meal.student_price, "asc"],
    kcal_per_euro: [(meal) => meal.kcal_per_euro, "desc", (meal) => meal.student_price, "asc"],
    price: [(meal) => meal.student_price, "asc", (meal) => meal.protein_per_euro, "desc"],
    kcal: [(meal) => meal.kcal_per_100g, "desc", (meal) => meal.student_price, "asc"],
  };
  const [primary, primaryDirection, secondary, secondaryDirection] = sorters[state.sort];
  return [...meals].sort((a, b) => compareValue(primary(a), primary(b), primaryDirection) || compareValue(secondary(a), secondary(b), secondaryDirection));
}

function compareValue(a, b, direction) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  return direction === "asc" ? a - b : b - a;
}

function renderMealCard(meal) {
  const article = document.createElement("article");
  article.className = "meal-card";

  const title = document.createElement("h2");
  title.textContent = meal.name;
  article.append(title);

  const meta = document.createElement("div");
  meta.className = "meal-meta";
  if (meal.category) meta.append(badge(meal.category));
  if (meal.is_vegan) meta.append(badge("vegan"));
  else if (meal.is_vegetarian) meta.append(badge("vegetarisch"));
  if (meal.is_side) meta.append(badge("Beilage"));
  article.append(meta);

  const metrics = document.createElement("dl");
  metrics.className = "metrics";
  metrics.append(metric("Studis", formatEuro(meal.student_price)));
  metrics.append(metric("Eiweiß/€", formatNumber(meal.protein_per_euro, "g")));
  metrics.append(metric("kcal/€", formatNumber(meal.kcal_per_euro, "kcal")));
  metrics.append(metric("Eiweiß", formatNumber(meal.protein_g_per_100g, "g/100 g")));
  metrics.append(metric("Kalorien", formatNumber(meal.kcal_per_100g, "kcal/100 g")));
  article.append(metrics);

  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "Weitere Werte";
  details.append(summary);
  const detailList = document.createElement("dl");
  detailList.className = "detail-list";
  detailList.append(metric("Fett", formatNumber(meal.fat_g_per_100g, "g/100 g")));
  detailList.append(metric("Kohlenhydrate", formatNumber(meal.carbohydrates_g_per_100g, "g/100 g")));
  detailList.append(metric("Zucker", formatNumber(meal.sugar_g_per_100g, "g/100 g")));
  detailList.append(metric("Salz", formatNumber(meal.salt_g_per_100g, "g/100 g")));
  detailList.append(metric("CO2 Portion", formatNumber(meal.co2_per_portion_g, "g")));
  details.append(detailList);
  article.append(details);

  return article;
}

function badge(text) {
  const span = document.createElement("span");
  span.className = "badge";
  span.textContent = text;
  return span;
}

function metric(label, value) {
  const item = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");
  term.textContent = label;
  description.textContent = value;
  item.append(term, description);
  return item;
}

function formatEuro(value) {
  return value == null ? "unbekannt" : `${value.toFixed(2).replace(".", ",")} €`;
}

function formatNumber(value, unit) {
  return value == null ? "unbekannt" : `${String(value).replace(".", ",")} ${unit}`;
}

function shortDate(value) {
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit" }).format(localDate(value));
}

function localDate(value) {
  return new Date(`${value}T12:00:00`);
}

function showLoadError(error) {
  document.getElementById("freshness").textContent = "Daten konnten nicht geladen werden.";
  const status = document.getElementById("day-status");
  status.hidden = false;
  status.textContent = `Die Speiseplandaten fehlen oder sind beschädigt: ${error.message}`;
}
