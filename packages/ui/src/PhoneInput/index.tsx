/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { env } from "process";
import type { CountryCallingCode, E164Number } from "libphonenumber-js";
import type { Country } from "react-phone-number-input/input";
import { useState } from "react";
import i18nIsoCountries from "i18n-iso-countries";
import enCountries from "i18n-iso-countries/langs/en.json";
import frCountries from "i18n-iso-countries/langs/fr.json";
import i18next from "i18next";
import {
  getExampleNumber,
  isValidPhoneNumber as matchIsValidPhoneNumber,
} from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";
import flags from "react-phone-number-input/flags";
import PhoneInput from "react-phone-number-input/input";

import { cn } from "..";
import { Input } from "../input";
import { ComboboxCountryInput } from "./CountryFlagSelector";
import {
  getCountriesOptions,
  replaceNumbersWithZeros,
} from "./PhoneInputHelpers";

export interface CountryOption {
  value: Country;
  label: string;
  indicatif: CountryCallingCode;
}

i18nIsoCountries.registerLocale(
  i18next.language == "fr" ? frCountries : enCountries,
);

interface PhoneInputFieldProps {
  disabled?: boolean;
  flagClassName?: string;
  inputClassName?: string;
  className?: string;
  onChange?: (value: string) => void; // ISO 3166-1 alpha-2 code (e.g. "US", "CM", "FR")
  defaultCountry?: string; // ISO 3166-1 alpha-2 code (e.g. "US", "CM", "FR")
}

export default function PhoneInputField({
  disabled,
  onChange,
  flagClassName,
  inputClassName,
  className,
}: PhoneInputFieldProps) {
  const options = getCountriesOptions() as CountryOption[];

  // You can use a the country of the phone number to set the default country
  const defaultCountry = env.NEXT_PUBLIC_DEFAULT_COUNTRY as Country;
  const defaultCountryOption = options.find(
    (option) => option.value === defaultCountry,
  );

  const [country, setCountry] = useState<CountryOption>(
    defaultCountryOption ??
      ({
        value: "CM",
        label: "Cameroon",
        indicatif: "+237",
      } as CountryOption),
  );

  const [phoneNumber, setPhoneNumber] = useState<E164Number>();

  const placeholder = replaceNumbersWithZeros(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    getExampleNumber(country.value, examples)!.formatInternational(),
  );

  const onCountryChange = (value: CountryOption) => {
    setPhoneNumber(undefined);
    setCountry(value);
    onChange?.(value.value as string);
  };

  const isValidPhoneNumber = matchIsValidPhoneNumber(phoneNumber ?? "");

  return (
    <div className="not-prose mt-8 flex flex-col gap-4">
      <div className={cn("flex gap-0", className)}>
        <ComboboxCountryInput
          disabled={disabled}
          value={country.value}
          className={flagClassName}
          onValueChange={onCountryChange}
          options={options}
          placeholder="Find your country..."
          renderOption={({ option }) => {
             
            const Flag = country && flags[option.value];
            return (
              <div className="flex w-full items-center justify-between px-2 text-sm">
                <div className="flex flex-row items-center gap-2">
                  <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20">
                    {Flag && <Flag title={option.label ?? ""} />}
                  </span>
                  <span>{option.label}</span>
                </div>
                <span>{option.indicatif}</span>
              </div>
            );
          }}
          renderValue={(option) => option.label}
          emptyMessage="No country found."
        />
        <PhoneInput
          international
          withCountryCallingCode
          country={country.value.toUpperCase() as Country}
          value={phoneNumber}
          className={cn("rounded-e-lg rounded-s-none", inputClassName)}
          inputComponent={Input}
          placeholder={placeholder}
          onChange={(value) => {
            setPhoneNumber(value);
          }}
        />
      </div>
      {/* <span className="text-sm">country: {country.label}</span>
      <span className="text-sm">indicatif: {country.indicatif}</span>
      <span className="text-sm">placeholder: {placeholder}</span>
      <span className="text-sm">value: {phoneNumber}</span>
      <span
        className={cn(
          "text-sm",
          isValidPhoneNumber ? "text-green-500" : "text-red-500"
        )}
      >
        isValid: {isValidPhoneNumber ? "true" : "false"}
      </span> */}
    </div>
  );
}
