/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { DatePicker } from "~/components/DatePicker";
import { CountryPicker } from "~/components/shared/CountryPicker";
import { ClubMultiSelector } from "~/components/shared/selects/ClubMultiSelector";
import { ReligionSelector } from "~/components/shared/selects/ReligionSelector";
import { SportMultiSelector } from "~/components/shared/selects/SportMultiSelector";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { UserIcon } from "~/icons";
import { useSchool } from "~/providers/SchoolProvider";

export function Step1() {
  const form = useFormContext();
  const t = useTranslations();
  const { school } = useSchool();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon />
          {t("Basic Information")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("lastName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("lastName")} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("firstName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("firstName")} {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("dateOfBirth")}</FormLabel>
              <FormControl>
                <DatePicker
                  defaultValue={field.value}
                  onSelectAction={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("placeOfBirth")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <FormField
            control={form.control}
            name="residence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("address")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("phoneNumber")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("gender")}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("gender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("male")}</SelectItem>
                    <SelectItem value="female">{t("female")}</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="col-span-full" />
        <FormField
          control={form.control}
          name="countryId"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel htmlFor="countryId">{t("citizenship")}</FormLabel>
              <FormControl>
                <CountryPicker
                  placeholder={t("citizenship")}
                  onChange={field.onChange}
                  defaultValue={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("registrationNumber")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {school.requestSunPlusNo && (
          <FormField
            control={form.control}
            name="externalAccountingNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("External account number")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Separator className="col-span-full" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="religionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("religion")}</FormLabel>
                <FormControl>
                  <ReligionSelector
                    onChange={field.onChange}
                    defaultValue={field.value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isBaptized"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("baptized")} ?</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value ? "yes" : "no"}
                    onValueChange={(val) => {
                      field.onChange(val === "yes");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("baptized")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">{t("yes")}</SelectItem>
                      <SelectItem value="no">{t("no")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="bloodType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Blood Type")}</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("Select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clubs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("clubs")}</FormLabel>
                <FormControl>
                  <ClubMultiSelector
                    onChangeAction={(values) => field.onChange(values)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="sports"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("sports")}</FormLabel>
                <FormControl>
                  <SportMultiSelector
                    onChangeAction={(values) => field.onChange(values)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-full grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="allergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Allergies & Medical Conditions")}</FormLabel>
                <FormControl>
                  <Textarea
                    id="allergies"
                    className="resize-none"
                    {...field}
                    placeholder={t("List any allergies or medical conditions")}
                    rows={2}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="observation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Observation")}</FormLabel>
                <FormControl>
                  <Textarea
                    id="observation"
                    className="resize-none"
                    {...field}
                    placeholder={"Observation..."}
                    rows={2}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
