const state = {
  data: null,
  locationId: localStorage.getItem("mensa-location") || "vaihingen",
  dayIndex: 0,
  filter: "all",
  sort: "health_score",
  tableSortKey: "health_score",
  tableSortDirection: "desc",
};

let closeActiveMealDialog = null;

const tableColumns = [
  { key: "name", label: "Gericht", type: "text", format: (meal) => meal.name },
  { key: "health_score", label: "Gesundheit", type: "number", format: (meal) => formatHealthScore(meal) },
  { key: "category", label: "Kategorie", type: "text", format: (meal) => meal.category || "unbekannt" },
  { key: "diet", label: "Ernährung", type: "text", format: (meal) => meal.is_vegan ? "vegan" : meal.is_vegetarian ? "vegetarisch" : "sonstiges" },
  { key: "is_side", label: "Beilage", type: "boolean", format: (meal) => meal.is_side ? "Ja" : "Nein" },
  { key: "student_price", label: "Studis", type: "number", format: (meal) => formatEuro(meal.student_price) },
  { key: "protein_per_euro", label: "Eiweiß/€", type: "number", format: (meal) => formatNumber(meal.protein_per_euro, "g") },
  { key: "kcal_per_euro", label: "kcal/€", type: "number", format: (meal) => formatNumber(meal.kcal_per_euro, "kcal") },
  { key: "protein_g_per_100g", label: "Eiweiß", type: "number", format: (meal) => formatNumber(meal.protein_g_per_100g, "g/100 g") },
  { key: "kcal_per_100g", label: "Kalorien", type: "number", format: (meal) => formatNumber(meal.kcal_per_100g, "kcal/100 g") },
  { key: "fat_g_per_100g", label: "Fett", type: "number", format: (meal) => formatNumber(meal.fat_g_per_100g, "g/100 g") },
  { key: "carbohydrates_g_per_100g", label: "Kohlenhydrate", type: "number", format: (meal) => formatNumber(meal.carbohydrates_g_per_100g, "g/100 g") },
  { key: "sugar_g_per_100g", label: "Zucker", type: "number", format: (meal) => formatNumber(meal.sugar_g_per_100g, "g/100 g") },
  { key: "salt_g_per_100g", label: "Salz", type: "number", format: (meal) => formatNumber(meal.salt_g_per_100g, "g/100 g") },
  { key: "co2_per_portion_g", label: "CO2 Portion", type: "number", format: (meal) => formatNumber(meal.co2_per_portion_g, "g") },
];

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
    state.tableSortKey = {
      price: "student_price",
      protein: "protein_g_per_100g",
      kcal: "kcal_per_100g",
    }[event.target.value] || event.target.value;
    state.tableSortDirection = event.target.value === "price" ? "asc" : "desc";
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
  freshness.classList.remove("is-loading");
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
  const highlights = document.getElementById("meal-highlights");
  document.querySelectorAll(".meal-preview-dialog").forEach((dialog) => dialog.remove());
  const day = currentLocation().days[state.dayIndex];
  const meals = filterMeals(day.meals || []);
  grid.innerHTML = "";
  highlights.innerHTML = "";
  highlights.hidden = true;
  grid.className = "meal-table-wrapper";

  const heading = `${currentLocation().name}, ${fullDate.format(localDate(day.date))}`;
  if (day.status === "closed") {
    status.hidden = false;
    status.dataset.state = "closed";
    status.textContent = `${heading}: ${day.message || "geschlossen"}`;
    return;
  }
  if (meals.length === 0) {
    status.hidden = false;
    status.dataset.state = "empty";
    status.textContent = `${heading}: Keine Gerichte passen zu deinem Filter.`;
    return;
  }

  status.hidden = false;
  status.dataset.state = "results";
  status.textContent = `${heading}: ${meals.length} Gerichte`;
  renderMealHighlights(meals);
  grid.append(renderMealTable(sortMealsByColumn(meals)));

  function renderMealHighlights(meals) {
    const scoredMeals = meals.filter((meal) => healthScore(meal) != null);
    if (!scoredMeals.length) return;
    const highlights = document.getElementById("meal-highlights");
    const best = [...scoredMeals].sort((a, b) => healthScore(b) - healthScore(a))[0];
    const protein = [...meals].sort((a, b) => compareValue(a.protein_g_per_100g, b.protein_g_per_100g, "desc"))[0];
    const affordable = [...meals].sort((a, b) => compareValue(a.student_price, b.student_price, "asc"))[0];
    [
      ["Top-Bewertung", best, formatHealthScore(best)],
      ["Proteinreich", protein, formatNumber(protein?.protein_g_per_100g, "g/100 g")],
      ["Günstigstes", affordable, formatEuro(affordable?.student_price)],
    ].forEach(([label, meal, value]) => {
      if (!meal) return;
      const item = document.createElement("article");
      item.className = "highlight-card";
      item.tabIndex = 0;
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", `${meal.name}, ${label}. Details öffnen`);
      item.append(badge(label));
      const title = document.createElement("strong");
      title.textContent = meal.name;
      const detail = document.createElement("span");
      detail.textContent = value;
      item.append(title, detail);
      item.addEventListener("click", () => openMealDialog(meal));
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openMealDialog(meal);
        }
      });
      highlights.append(item);
    });
    highlights.hidden = false;
  }
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
  return [...meals].sort((a, b) => compareMealPriority(a, b)
    || compareValue(primary(a), primary(b), primaryDirection)
    || compareValue(secondary(a), secondary(b), secondaryDirection));
}

function sortMealsByColumn(meals) {
  const column = tableColumns.find((item) => item.key === state.tableSortKey) || tableColumns[0];
  return [...meals].sort((a, b) => {
    const priority = compareMealPriority(a, b);
    if (priority) return priority;
    const valueA = columnValue(column, a);
    const valueB = columnValue(column, b);
    if (valueA == null || valueB == null) {
      return valueA == null && valueB == null ? 0 : valueA == null ? 1 : -1;
    }
    const result = compareColumnValues(column, a, b);
    return state.tableSortDirection === "asc" ? result : -result;
  });
}

function compareMealPriority(a, b) {
  return Number(isSecondaryMeal(a)) - Number(isSecondaryMeal(b));
}

function isSecondaryMeal(meal) {
  const category = (meal.category || "").toLowerCase();
  return ["vorspeise", "beilage", "dessert", "buffet"].some((keyword) => category.includes(keyword));
}

function compareColumnValues(column, a, b) {
  const valueA = columnValue(column, a);
  const valueB = columnValue(column, b);
  if (valueA == null && valueB == null) return 0;
  if (valueA == null) return 1;
  if (valueB == null) return -1;
  if (column.type === "text") return String(valueA).localeCompare(String(valueB), "de");
  if (column.type === "boolean") return Number(valueA) - Number(valueB);
  return valueA - valueB;
}

function columnValue(column, meal) {
  if (column.key === "diet") return meal.is_vegan ? "vegan" : meal.is_vegetarian ? "vegetarisch" : "sonstiges";
  if (column.key === "health_score") return healthScore(meal);
  return meal[column.key];
}

function renderMealTable(meals) {
  const table = document.createElement("table");
  table.className = "meal-table";
  const caption = document.createElement("caption");
  caption.textContent = "Gerichte und Nährwerte";
  table.append(caption);

  const head = document.createElement("thead");
  const headerRow = document.createElement("tr");
  tableColumns.forEach((column) => {
    const header = document.createElement("th");
    header.scope = "col";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sort-button";
    button.textContent = column.label;
    button.setAttribute("aria-label", `${column.label} sortieren`);
    if (state.tableSortKey === column.key) {
      button.dataset.direction = state.tableSortDirection;
      button.setAttribute("aria-label", `${column.label}, ${state.tableSortDirection === "asc" ? "aufsteigend" : "absteigend"} sortiert`);
    }
    button.addEventListener("click", () => {
      if (state.tableSortKey === column.key) {
        state.tableSortDirection = state.tableSortDirection === "asc" ? "desc" : "asc";
      } else {
        state.tableSortKey = column.key;
        state.tableSortDirection = column.type === "number" || column.type === "boolean" ? "desc" : "asc";
      }
      const selectValue = ["student_price", "protein_per_euro", "kcal_per_euro", "protein_g_per_100g", "kcal_per_100g"].includes(column.key)
        ? column.key === "student_price" ? "price" : column.key === "protein_g_per_100g" ? "protein" : column.key === "kcal_per_100g" ? "kcal" : column.key
        : null;
      if (selectValue) {
        state.sort = selectValue;
        document.getElementById("sort-select").value = selectValue;
      }
      renderMeals();
    });
    header.append(button);
    headerRow.append(header);
  });
  head.append(headerRow);
  table.append(head);

  const body = document.createElement("tbody");
  meals.forEach((meal) => {
    const row = document.createElement("tr");
    tableColumns.forEach((column) => {
      const cell = document.createElement("td");
      if (column.key === "health_score") {
        const score = healthScore(meal);
        const scoreBadge = document.createElement("span");
        scoreBadge.className = `score-badge ${score == null ? "unknown" : score >= 80 ? "high" : score >= 60 ? "medium" : "low"}`;
        scoreBadge.textContent = score == null ? "n/a" : score;
        scoreBadge.title = formatHealthScore(meal);
        cell.append(scoreBadge, document.createTextNode(score == null ? " eingeschränkt" : ` ${healthLabel(score)}`));
      } else if (column.key !== "name") {
        cell.textContent = column.format(meal);
      }
      if (column.key === "name") {
        cell.className = "meal-name";
        cell.textContent = meal.name;
      }
      if (column.key === "health_score") cell.className = `health-score health-score-${healthScore(meal) == null ? "unknown" : healthScore(meal) >= 80 ? "high" : healthScore(meal) >= 60 ? "medium" : "low"}`;
      row.append(cell);
    });
    row.className = "meal-row-action";
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-label", `${meal.name} Details öffnen`);
    row.addEventListener("click", (event) => {
      event.stopPropagation();
      openMealDialog(meal);
    });
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openMealDialog(meal);
      }
    });
    body.append(row);
  });
  table.append(body);
  return table;
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
  title.append(mealPreview(meal));
  article.append(title);

  const score = healthScore(meal);
  const scoreBanner = document.createElement("div");
  scoreBanner.className = `card-score ${score == null ? "unknown" : score >= 80 ? "high" : score >= 60 ? "medium" : "low"}`;
  scoreBanner.innerHTML = `<strong>${score == null ? "n/a" : score}</strong><span>${score == null ? "eingeschränkte Bewertung" : healthLabel(score)}</span>`;
  article.append(scoreBanner);

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
  const healthMetric = metric("Gesundheit", formatHealthScore(meal));
  healthMetric.classList.add("health-metric");
  healthMetric.dataset.level = healthScore(meal) == null ? "unknown" : healthScore(meal) >= 80 ? "high" : healthScore(meal) >= 60 ? "medium" : "low";
  metrics.append(healthMetric);
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
  detailList.append(metric("Bewertung", healthReasons(meal).join(", ")));
  detailList.append(metric("CO2 Portion", formatNumber(meal.co2_per_portion_g, "g")));
  details.append(detailList);
  article.append(details);

  return article;
}

function healthScore(meal) {
  const values = [
    meal.protein_g_per_100g,
    meal.kcal_per_100g,
    meal.sugar_g_per_100g,
    meal.salt_g_per_100g,
    meal.saturated_fat_g_per_100g,
    meal.fat_g_per_100g,
  ];
  if (values.some((value) => value == null)) {
    return null;
  }

  const protein = Math.min(20, meal.protein_g_per_100g / 15 * 20);
  const energy = meal.kcal_per_100g >= 120 && meal.kcal_per_100g <= 250
    ? 10
    : Math.max(0, 10 - Math.abs(meal.kcal_per_100g - (meal.kcal_per_100g < 120 ? 120 : 250)) / 25);
  const sugarPenalty = Math.min(15, Math.max(0, meal.sugar_g_per_100g - 5) * 1.5);
  const saltPenalty = Math.min(22, Math.max(0, meal.salt_g_per_100g - 1) * 12);
  const saturatedFatPenalty = Math.min(15, Math.max(0, meal.saturated_fat_g_per_100g - 5) * 2);
  const fatPenalty = Math.min(10, Math.max(0, meal.fat_g_per_100g - 20) * 0.5);
  const dietBonus = meal.is_vegan ? 3 : meal.is_vegetarian ? 2 : 0;
  return Math.round(Math.max(0, Math.min(100, 55 + protein + energy + dietBonus - sugarPenalty - saltPenalty - saturatedFatPenalty - fatPenalty)));
}

function healthLabel(score) {
  if (score == null) return "eingeschränkt";
  if (score >= 80) return "sehr ausgewogen";
  if (score >= 60) return "ausgewogen";
  if (score >= 40) return "mittel";
  return "eher unausgewogen";
}

function formatHealthScore(meal) {
  const score = healthScore(meal);
  return score == null ? "eingeschränkt" : `${score}/100 (${healthLabel(score)})`;
}

function healthReasons(meal) {
  const score = healthScore(meal);
  if (score == null) return ["Nährwerte fehlen"];
  const reasons = [];
  if (meal.protein_g_per_100g >= 10) reasons.push("gute Eiweißdichte");
  if (meal.sugar_g_per_100g > 10) reasons.push("viel Zucker");
  else if (meal.sugar_g_per_100g <= 5) reasons.push("wenig Zucker");
  if (meal.salt_g_per_100g > 1.5) reasons.push("erhöhter Salzgehalt");
  else if (meal.salt_g_per_100g <= 1) reasons.push("moderater Salzgehalt");
  if (meal.saturated_fat_g_per_100g > 5) reasons.push("mehr gesättigte Fettsäuren");
  if (meal.is_vegan || meal.is_vegetarian) reasons.push(meal.is_vegan ? "vegan" : "vegetarisch");
  return reasons.length ? reasons : [healthLabel(score)];
}

function badge(text) {
  const span = document.createElement("span");
  span.className = "badge";
  span.textContent = text;
  return span;
}

function mealPreview(meal) {
  const wrapper = document.createElement("span");
  wrapper.className = "meal-preview";
  const imagePath = meal.image && /\/Speisefotos\//i.test(meal.image) ? meal.image : null;
  wrapper.tabIndex = imagePath ? 0 : -1;
  if (imagePath) {
    wrapper.setAttribute("role", "button");
    wrapper.setAttribute("aria-label", `${meal.name} Bildvorschau öffnen`);
    wrapper.setAttribute("aria-expanded", "false");
  }

  wrapper.textContent = meal.name;

  if (!imagePath) return wrapper;

  const image = document.createElement("img");
  image.src = imageUrl(imagePath);
  image.alt = "";
  image.loading = "lazy";
  image.className = "meal-preview-dialog-image";
  image.setAttribute("aria-hidden", "true");
  const dialog = document.createElement("article");
  dialog.className = "meal-preview-dialog";
  dialog.append(image, mealPreviewDetails(meal));
  document.body.append(dialog);
  let isPinned = false;
  const togglePreview = (event) => {
    event.stopPropagation();
    if (isPinned) {
      closePinnedPreview();
    } else {
      isPinned = true;
      wrapper.setAttribute("aria-expanded", "true");
      document.body.classList.add("preview-open");
      dialog.classList.add("is-preview-visible");
    }
  };
  wrapper.addEventListener("click", togglePreview);
  wrapper.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePreview(event);
    }
  });
  dialog.addEventListener("click", closePinnedPreview);
  image.addEventListener("error", () => {
    wrapper.classList.add("has-image-error");
    dialog.remove();
  });
  return wrapper;

  function closePinnedPreview() {
    isPinned = false;
    wrapper.setAttribute("aria-expanded", "false");
    document.body.classList.remove("preview-open");
    dialog.remove();
  }
}

function openMealDialog(meal) {
  closeActiveMealDialog?.();
  const backdrop = document.createElement("div");
  backdrop.className = "preview-backdrop";
  const dialog = document.createElement("article");
  const imagePath = meal.image && /\/Speisefotos\//i.test(meal.image) ? meal.image : null;
  dialog.className = `meal-preview-dialog is-preview-visible${imagePath ? "" : " no-image"}`;
  if (imagePath) {
    const image = document.createElement("img");
    image.src = imageUrl(imagePath);
    image.alt = "";
    image.className = "meal-preview-dialog-image";
    image.addEventListener("error", () => image.remove());
    dialog.append(image);
  }
  dialog.append(mealPreviewDetails(meal));
  const close = () => {
    dialog.remove();
    backdrop.remove();
    document.body.classList.remove("preview-open");
    if (closeActiveMealDialog === close) {
      closeActiveMealDialog = null;
    }
  };
  backdrop.addEventListener("click", close);
  dialog.addEventListener("click", close);
  const closeOnEscape = (event) => {
    if (event.key === "Escape") close();
  };
  document.addEventListener("keydown", closeOnEscape);
  closeActiveMealDialog = () => {
    document.removeEventListener("keydown", closeOnEscape);
    close();
  };
  document.body.append(backdrop, dialog);
  document.body.classList.add("preview-open");
}

function mealPreviewDetails(meal) {
  const details = document.createElement("div");
  details.className = "meal-preview-details";
  const title = document.createElement("h2");
  title.textContent = meal.name;
  details.append(title);

  const meta = document.createElement("div");
  meta.className = "meal-meta";
  if (meal.category) meta.append(badge(meal.category));
  if (meal.is_vegan) meta.append(badge("vegan"));
  else if (meal.is_vegetarian) meta.append(badge("vegetarisch"));
  if (meal.is_side) meta.append(badge("Beilage"));
  details.append(meta);

  const sections = [
    ["Preise", [
      ["Studierendenpreis", formatEuro(meal.student_price)],
      ["Bedienstetenpreis", formatEuro(meal.employee_price)],
      ["Gästepreis", formatEuro(meal.guest_price)],
    ]],
    ["Kennzahlen", [
      ["Gesundheit", formatHealthScore(meal)],
      ["Eiweiß/€", formatNumber(meal.protein_per_euro, "g")],
      ["Kalorien/€", formatNumber(meal.kcal_per_euro, "kcal")],
    ]],
    ["Nährwerte pro 100 g", [
      ["Energie", formatNumber(meal.energy_kj_per_100g, "kJ")],
      ["Kalorien", formatNumber(meal.kcal_per_100g, "kcal")],
      ["Eiweiß", formatNumber(meal.protein_g_per_100g, "g")],
      ["Fett", formatNumber(meal.fat_g_per_100g, "g")],
      ["Gesättigte Fettsäuren", formatNumber(meal.saturated_fat_g_per_100g, "g")],
      ["Kohlenhydrate", formatNumber(meal.carbohydrates_g_per_100g, "g")],
      ["Zucker", formatNumber(meal.sugar_g_per_100g, "g")],
      ["Salz", formatNumber(meal.salt_g_per_100g, "g")],
    ]],
    ["Weitere Angaben", [
      ["CO2 pro Portion", formatNumber(meal.co2_per_portion_g, "g")],
      ["Bewertung", healthReasons(meal).join(", ")],
    ]],
  ];

  sections.forEach(([heading, values]) => {
    const section = document.createElement("section");
    section.className = "preview-section";
    const sectionHeading = document.createElement("h3");
    sectionHeading.textContent = heading;
    const metrics = document.createElement("dl");
    metrics.className = "preview-metrics";
    values.forEach(([label, value]) => metrics.append(metric(label, value)));
    section.append(sectionHeading, metrics);
    details.append(section);
  });
  return details;
}

function imageUrl(path) {
  return new URL(path, "https://sws2.maxmanager.xyz/").href;
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
  const freshness = document.getElementById("freshness");
  freshness.classList.remove("is-loading");
  freshness.classList.add("stale");
  freshness.textContent = "Daten konnten nicht geladen werden.";
  const status = document.getElementById("day-status");
  status.hidden = false;
  status.dataset.state = "error";
  status.textContent = `Die Speiseplandaten fehlen oder sind beschädigt: ${error.message}`;
}
