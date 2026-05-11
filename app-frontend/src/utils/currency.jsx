// src/utils/currency.js
export const formatPrice = (priceInEur) => {
  const eur = Number(priceInEur) || 0;
  const bgn = eur * 1.95583;

  return `€${eur.toFixed(2)} / ${bgn.toFixed(2)} лв.`;
};