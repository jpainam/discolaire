/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Textarea } from "@repo/ui/components/textarea";

import type { Option } from "~/components/multiselect";
import { DatePicker } from "~/components/DatePicker";
import MultipleSelector from "~/components/multiselect";
import { CountryPicker } from "~/components/shared/CountryPicker";
import { ReligionSelector } from "~/components/shared/selects/ReligionSelector";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";

export function Step1() {
  const form = useFormContext();
  const t = useTranslations();
  const { school } = useSchool();
  const trpc = useTRPC();
  const clubsQuery = useQuery(trpc.setting.clubs.queryOptions());
  const sportsQuery = useQuery(trpc.setting.sports.queryOptions());
  const sportOptions: Option[] = sportsQuery.data
    ? sportsQuery.data.map((sport) => ({
        label: sport.name,
        value: sport.id,
      }))
    : [];

  const clubOptions: Option[] = clubsQuery.data
    ? clubsQuery.data.map((club) => ({
        label: club.name,
        value: club.id,
      }))
    : [];
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-md flex items-center gap-2">
          <User className="h-4 w-4" />
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
                  onChange={field.onChange}
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
              <FormItem className="flex-1">
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
                      <SelectValue placeholder={t("Select Blood Type")} />
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
              <FormItem className="flex-1">
                <FormLabel>{t("clubs")}</FormLabel>
                <FormControl>
                  {clubsQuery.isPending ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <MultipleSelector
                      commandProps={{
                        label: t("select_options"),
                      }}
                      value={field.value}
                      defaultOptions={clubOptions}
                      //options={clubOptions}
                      onChange={(values) => {
                        field.onChange(values);
                      }}
                      hidePlaceholderWhenSelected
                      emptyIndicator={
                        <p className="text-center text-sm">{t("no_results")}</p>
                      }
                    />
                  )}
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
              <FormItem className="flex-1">
                <FormLabel>{t("sports")}</FormLabel>
                <FormControl>
                  {sportsQuery.isPending ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <MultipleSelector
                      commandProps={{
                        label: t("select_options"),
                      }}
                      value={field.value}
                      defaultOptions={sportOptions}
                      //options={sportOptions}
                      onChange={(values) => {
                        field.onChange(values);
                      }}
                      hidePlaceholderWhenSelected
                      emptyIndicator={
                        <p className="text-center text-sm">{t("no_results")}</p>
                      }
                    />
                  )}
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
