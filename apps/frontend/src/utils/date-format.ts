import { useLocale } from "~/hooks/use-locale";

export function useDateFormat() {
  const { i18n } = useLocale();
  const monthFormatter = new Intl.DateTimeFormat(i18n.language, {
    month: "short",
  });
  const dayFormatter = new Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
  });
  const fullDateFormatter = new Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const fullDateTimeFormatter = new Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  return {
    monthFormatter,
    dayFormatter,
    fullDateTimeFormatter,
    fullDateFormatter,
  };
}
