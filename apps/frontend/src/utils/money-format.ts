import i18next from "i18next";

export function asThousands(amount: number): string {
  const entier = `${amount}`;
  let n = entier;
  let tmp = "";
  let c = 0;
  if (n.length > 3) {
    for (let i = n.length - 1; i >= 0; i--, c++) {
      if (c === 3) {
        tmp = " " + tmp;
        c = 0;
      }
      tmp = n.substring(i, 1) + tmp;
    }
    return tmp;
  } else {
    return n;
  }
}

export function useMoneyFormat() {
  const moneyFormatter = new Intl.NumberFormat(i18next.language, {
    style: "currency",
    currency: "CFA",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  const thousandFormatter = new Intl.NumberFormat(i18next.language);

  return {
    moneyFormatter,
    thousandFormatter,
  };
}
