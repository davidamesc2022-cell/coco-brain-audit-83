import { describe, it, expect } from "vitest";
import { getRecommendationsForArea } from "../data/auditData";

describe("getRecommendationsForArea", () => {
  const businessTypes = ["productos", "servicios", "local", "digital", undefined];
  const operatingTimes = ["iniciando", "crecimiento", "consolidacion", "trayectoria", undefined];
  const scores = [0, 20, 39, 40, 50, 69, 70, 85, 100];
  const areas = [1, 2, 3, 4, 5, 6];

  it("should not crash for any combination of area, score, businessType, and operatingTime", () => {
    for (const area of areas) {
      for (const score of scores) {
        for (const businessType of businessTypes) {
          for (const operatingTime of operatingTimes) {
            const recs = getRecommendationsForArea(area, score, businessType, operatingTime);
            expect(Array.isArray(recs)).toBe(true);
            expect(recs.length).toBeGreaterThan(0);
            for (const rec of recs) {
              expect(typeof rec).toBe("string");
            }
          }
        }
      }
    }
  });
});
