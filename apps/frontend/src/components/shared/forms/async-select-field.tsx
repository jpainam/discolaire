import AsyncSelect from "react-select/async";

interface AsyncSelectFieldProps {
  className?: string;
  name: string;
  label?: string;
  onChange?: (value: string) => void;
  defaultValue?: string | number;
  placeholder?: string;
  labelClassName?: string;
  items: { value: string; label: string }[];
  selectClassName?: string;
  description?: string;
  descriptionClassName?: string;
  disabled?: boolean;
}

export function AsyncSelectField({}: AsyncSelectFieldProps) {
  return <AsyncSelect cacheOptions defaultOptions />;
}
