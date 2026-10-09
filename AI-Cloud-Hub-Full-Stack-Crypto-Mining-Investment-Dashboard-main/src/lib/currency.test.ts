import { describe, expect, it } from "vitest";
import {
  formatCurrencyText,
  formatUsd,
  formatUsdMinimum,
  lkrToUsd,
  usdToLkr,
} from "./currency";

describe("currency conversion", () => {
  it("converts between the internal LKR ledger and USD at the fixed rate", () => {
    expect(lkrToUsd(330.69)).toBe(1);
    expect(usdToLkr(1)).toBe(330.69);
    expect(formatUsd(330.69)).toBe("$1.00");
  });

  it("rounds USD input minimums upward so they meet the LKR threshold", () => {
    expect(formatUsdMinimum(500)).toBe("$1.52");
    expect(usdToLkr(1.52)).toBeGreaterThanOrEqual(500);
  });

  it("converts legacy notification amounts when rendering stored text", () => {
    expect(formatCurrencyText("Your deposit of Rs 5,000 was approved."))
      .toBe("Your deposit of $15.12 was approved.");
  });
});
