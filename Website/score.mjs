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

export { healthScore, healthLabel, formatHealthScore, healthReasons };
