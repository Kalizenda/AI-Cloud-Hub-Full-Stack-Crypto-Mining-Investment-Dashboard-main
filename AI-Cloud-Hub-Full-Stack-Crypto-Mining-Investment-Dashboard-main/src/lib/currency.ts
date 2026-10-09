// Fixed rate snapshot so stored LKR ledger values keep a consistent USD display.
const LKR_PER_USD = 330.69;

export const lkrToUsd = (amount: number) => amount / LKR_PER_USD;

export const usdToLkr = (amount: number) =>
  Math.round(amount * LKR_PER_USD * 100) / 100;

export const formatUsd = (lkrAmount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(lkrToUsd(Number(lkrAmount) || 0));

export const formatUsdMinimum = (lkrAmount: number) =>
  formatUsd(usdToLkr(Math.ceil(lkrToUsd(lkrAmount) * 100) / 100));

export const formatCurrencyText = (text: string) =>
  text.replace(/Rs\.?\s*([\d,]+(?:\.\d+)?)/gi, (_, amount: string) =>
    formatUsd(Number(amount.replace(/,/g, ""))),
  );
