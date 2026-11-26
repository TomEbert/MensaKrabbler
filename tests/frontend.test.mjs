import { test } from "node:test";
import assert from "node:assert/strict";
import { defaultDayIndex } from "../Website/dates.mjs";
import { mealMatchesFilter } from "../Website/labels.mjs";
import { healthScore } from "../Website/score.mjs";

test("defaults to tomorrow from 14:00 Berlin time when available", () => {
  const days = [{ date: "2026-07-01" }, { date: "2026-07-02" }];
  assert.equal(defaultDayIndex(days, new Date("2026-07-01T11:59Z")), 0);
  assert.equal(defaultDayIndex(days, new Date("2026-07-01T12:00Z")), 1);
  assert.equal(defaultDayIndex(days.slice(0, 1), new Date("2026-07-01T12:00Z")), 0);
});

test("matches combined labels but skips photo metadata and partial words", () => {
  const meal = { labels: ["Rind/Schwein", "Essensfoto Milch"] };
  assert.equal(mealMatchesFilter(meal, "exclude:pork"), false);
  assert.equal(mealMatchesFilter(meal, "exclude:milk"), true);
  assert.equal(mealMatchesFilter(meal, "exclude:egg"), true);
});

test("score preserves existing formula and handles missing values", () => {
  const meal = { protein_g_per_100g: 15, kcal_per_100g: 120, sugar_g_per_100g: 5,
    salt_g_per_100g: 1, saturated_fat_g_per_100g: 5, fat_g_per_100g: 20, is_vegan: true };
  assert.equal(healthScore(meal), 88);
  assert.equal(healthScore({ ...meal, salt_g_per_100g: 2 }), 76);
  assert.equal(healthScore({ ...meal, salt_g_per_100g: null }), null);
});
