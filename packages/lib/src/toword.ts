/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export function numberToWords(num: number, language = "en") {
  if (num === 0) {
    switch (language) {
      case "fr":
        return "zéro";
      case "es":
        return "cero";
      default:
        return "zero";
    }
  }

  const data: Record<string, any> = {
    en: {
      belowTwenty: [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
      ],
      tens: [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
      ],
      thousands: ["", "thousand", "million", "billion"],
    },
    fr: {
      belowTwenty: [
        "",
        "un",
        "deux",
        "trois",
        "quatre",
        "cinq",
        "six",
        "sept",
        "huit",
        "neuf",
        "dix",
        "onze",
        "douze",
        "treize",
        "quatorze",
        "quinze",
        "seize",
        "dix-sept",
        "dix-huit",
        "dix-neuf",
      ],
      tens: [
        "",
        "",
        "vingt",
        "trente",
        "quarante",
        "cinquante",
        "soixante",
        "soixante-dix",
        "quatre-vingt",
        "quatre-vingt-dix",
      ],
      thousands: ["", "mille", "million", "milliard"],
    },
    es: {
      belowTwenty: [
        "",
        "uno",
        "dos",
        "tres",
        "cuatro",
        "cinco",
        "seis",
        "siete",
        "ocho",
        "nueve",
        "diez",
        "once",
        "doce",
        "trece",
        "catorce",
        "quince",
        "dieciséis",
        "diecisiete",
        "dieciocho",
        "diecinueve",
      ],
      tens: [
        "",
        "",
        "veinte",
        "treinta",
        "cuarenta",
        "cincuenta",
        "sesenta",
        "setenta",
        "ochenta",
        "noventa",
      ],
      thousands: ["", "mil", "millón", "mil millones"],
    },
  };

  const belowTwenty = data[language].belowTwenty;
  const tens = data[language].tens;
  const thousands = data[language].thousands;

  function helper(n: number): string {
    if (n === 0) return "";
    else if (n < 20) return belowTwenty[n] + " ";
    else if (n < 100) {
      const remainder = n % 10;
      const tenText = tens[Math.floor(n / 10)];
      // Special case for French (for numbers 70-79 and 90-99)
      if (language === "fr" && n >= 70 && n < 80) {
        return "soixante-" + belowTwenty[10 + remainder];
      } else if (language === "fr" && n >= 90 && n < 100) {
        return "quatre-vingt-" + belowTwenty[10 + remainder];
      }
      return tenText + (remainder ? "-" + belowTwenty[remainder] : "");
    } else {
      return (
        belowTwenty[Math.floor(n / 100)] +
        (language === "fr" ? " cent " : " hundred ") +
        helper(n % 100)
      );
    }
  }

  let word = "";
  let i = 0;

  while (num > 0) {
    if (num % 1000 !== 0) {
      const chunk = helper(num % 1000).trim();
      // Insert a space before the thousand/million word if the chunk exists
      if (chunk) {
        word =
          chunk +
          " " +
          thousands[i] +
          (language === "fr" || language === "es" ? " " : "") +
          word;
      }
    }
    num = Math.floor(num / 1000);
    i++;
  }

  return word.trim();
}

// const amount = "50 000".replace(/\s+/g, ""); // Remove spaces
// const number = parseInt(amount, 10);

// const wordsInFrench = numberToWords(number, "fr");

// console.log("French: ", wordsInFrench); // Outputs: "cinquante mille"
