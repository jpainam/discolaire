import { useLocale } from "~/i18n";

export function useDateFormat() {
  const { i18n } = useLocale();

  const fullDateTimeFormatter = new Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  return {
    fullDateTimeFormatter,
  };
}
