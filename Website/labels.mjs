const labelCatalog = [
  { key: "vegan", label: "vegan", icon: "🌱", group: "plant" },
  { key: "vegetarian", label: "vegetarisch", icon: "🥕", group: "plant" },
  { key: "vegan-hit", label: "Veganer Renner", icon: "⭐", group: "feature", tokens: ["veganer renner"] },
  { key: "climate", label: "KlimaTeller", icon: "🌍", group: "feature", tokens: ["klimateller", "50% weniger co2"] },
  { key: "pork", label: "Schwein", icon: "🐖", group: "exclude", tokens: ["schwein"] },
  { key: "beef", label: "Rind", icon: "🐄", group: "exclude", tokens: ["rind"] },
  { key: "poultry", label: "Geflügel", icon: "🐔", group: "exclude", tokens: ["geflügel", "hähnchen", "pute"] },
  { key: "fish", label: "Fisch", icon: "🐟", group: "exclude", tokens: ["fisch", "msc"] },
  { key: "milk", label: "Milch", icon: "🥛", group: "exclude", tokens: ["milch", "laktose", "käse", "sahne"] },
  { key: "gluten", label: "Gluten", icon: "🌾", group: "exclude", tokens: ["gluten", "weizen", "roggen", "gerste", "dinkel"] },
  { key: "nuts", label: "Nüsse", icon: "🥜", group: "exclude", tokens: ["nuss", "nüsse", "erdnuss", "schalenfr"] },
  { key: "egg", label: "Ei", icon: "🥚", group: "exclude", tokens: ["ei"] },
  { key: "soy", label: "Soja", icon: "🫘", group: "exclude", tokens: ["soja"] },
  { key: "celery", label: "Sellerie", icon: "🥬", group: "exclude", tokens: ["sellerie"] },
  { key: "mustard", label: "Senf", icon: "🟡", group: "exclude", tokens: ["senf"] },
  { key: "sesame", label: "Sesam", icon: "⚪", group: "exclude", tokens: ["sesam"] },
  { key: "alcohol", label: "Alkohol", icon: "🍷", group: "exclude", tokens: ["alkohol", "wein"] },
];

const labelOrder = Object.fromEntries(labelCatalog.map((item, index) => [item.key, index]));


function mealMatchesFilter(meal, filterKey) {
  const [mode, key] = filterKey.split(":");
  const hasLabel = mealHasLabelKey(meal, key);
  return mode === "exclude" ? !hasLabel : hasLabel;
}

function mealHasLabelKey(meal, key) {
  if (key === "vegan") return Boolean(meal.is_vegan);
  if (key === "vegetarian") return Boolean(meal.is_vegetarian);
  return mealLabelBadges(meal).some((item) => item.key === key);
}

function mealLabelBadges(meal) {
  const labels = new Map();
  if (meal.is_vegan) labels.set("vegan", labelDefinition("vegan"));
  else if (meal.is_vegetarian) labels.set("vegetarian", labelDefinition("vegetarian"));
  (meal.labels || []).forEach((label) => {
    const normalized = normalizeLabel(label);
    if (!normalized) return;
    const knownLabels = labelsFromText(normalized, label);
    knownLabels.forEach((known) => labels.set(known.key, known));
  });
  return [...labels.values()].sort((a, b) => (labelOrder[a.key] ?? 99) - (labelOrder[b.key] ?? 99) || a.label.localeCompare(b.label, "de"));
}

function labelsFromText(normalized, original) {
  const matches = labelCatalog.filter((item) => item.tokens?.some((token) => labelTokenMatches(normalized, token)) || item.key === normalized);
  if (matches.length) return matches.map((item) => labelDefinition(item.key));
  return [{
    key: `custom-${normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    label: original,
    icon: "🏷️",
    group: "feature",
  }];
}

function labelTokenMatches(label, token) {
  if (token.includes(" ") || token.includes("%")) return label.includes(token);
  return label
    .split(/[^a-zäöüß0-9]+/i)
    .filter(Boolean)
    .some((word) => word === token || (token.endsWith("fr") && word.startsWith(token)));
}

function labelDefinition(key) {
  return labelCatalog.find((item) => item.key === key) || { key, label: key, icon: "🏷️", group: "feature" };
}

function normalizeLabel(label) {
  const trimmed = String(label || "").trim();
  if (!trimmed || /^essensfoto\b/i.test(trimmed)) return null;
  return trimmed.toLowerCase();
}

export { mealMatchesFilter, mealHasLabelKey, mealLabelBadges, labelDefinition };
