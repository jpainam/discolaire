"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { cn } from "@repo/ui/lib/utils";
import { Layout, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocale } from "~/i18n";
export function UserAppearance() {
  const { setTheme, resolvedTheme } = useTheme();
  const [fontSize, setFontSize] = useState("default");
  const form = useForm();
  const [layout, setLayout] = useState("default");
  const [sidebarPosition, setSidebarPosition] = useState("left");

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const handleFontSizeChange = (value: string) => {
    console.log("Font size changed to:", value);
    setFontSize(value);
  };

  const handleLayoutChange = (value: string) => {
    console.log("Layout changed to:", value);
    setLayout(value);
  };

  const handleSidebarChange = (value: string) => {
    console.log("Sidebar position changed to:", value);
    setSidebarPosition(value);
  };
  const { t } = useLocale();
  const plans = [
    {
      id: "starter",
      name: "Starter Plan",
      bg: "bg-green-500",
      price: "$10",
    },
    {
      id: "pro",
      name: "Pro Plan",
      bg: "bg-blue-500",
      price: "$20",
    },
    {
      id: "purple",
      name: "Purple",
      bg: "bg-purple-500",
    },
  ] as const;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Appearance
        </CardTitle>
        <CardDescription>
          Customize how the application looks and feels.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <RadioGroup
                    onValueChange={(val) => {
                      field.onChange(val);
                      toggleTheme();
                    }}
                    defaultValue={field.value}
                    className="grid max-w-md grid-cols-2 gap-8 pt-2"
                  >
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                        <FormControl>
                          <RadioGroupItem value="light" className="sr-only" />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                          <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                            <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                              <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                              <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                            </div>
                          </div>
                        </div>
                      </FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                        <FormControl>
                          <RadioGroupItem value="dark" className="sr-only" />
                        </FormControl>
                        <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                            <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                              <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                            </div>
                            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                              <div className="h-4 w-4 rounded-full bg-slate-400" />
                              <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                            </div>
                          </div>
                        </div>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="space-y-2">
          <Label htmlFor="primary-color">Primary Color</Label>
          <RadioGroup defaultValue="starter" className="flex flex-wrap gap-4">
            {plans.map((plan) => (
              <Label
                className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-4 has-[[data-state=checked]]:border-green-600 has-[[data-state=checked]]:bg-green-50 dark:has-[[data-state=checked]]:border-green-900 dark:has-[[data-state=checked]]:bg-green-950"
                key={plan.id}
              >
                <RadioGroupItem
                  value={plan.id}
                  id={plan.name}
                  className="shadow-none data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 *:data-[slot=radio-group-indicator]:[&>svg]:fill-white *:data-[slot=radio-group-indicator]:[&>svg]:stroke-white"
                />
                <div className="gap-1 items-center flex flex-row font-normal">
                  <div className={cn("h-4 w-4 rounded-full ", plan.bg)} />
                  {plan.name}
                </div>
              </Label>
            ))}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="color-custom" />
              <Label htmlFor="color-custom">Custom</Label>
              <Input type="color" className="h-8 w-12" />
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-size">Font Size</Label>
          <RadioGroup
            value={fontSize}
            onValueChange={handleFontSizeChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="small" id="font-small" />
              <Label htmlFor="font-small" className="text-sm">
                Small
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="font-default" />
              <Label htmlFor="font-default">Default</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="font-large" />
              <Label htmlFor="font-large" className="text-lg">
                Large
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="layout">Layout Style</Label>
          <RadioGroup
            value={layout}
            onValueChange={handleLayoutChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="layout-compact" />
              <Label
                htmlFor="layout-compact"
                className="flex items-center gap-1.5"
              >
                <Layout className="h-4 w-4" />
                Compact
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="spacious" id="layout-spacious" />
              <Label
                htmlFor="layout-spacious"
                className="flex items-center gap-1.5"
              >
                <Layout className="h-4 w-4" />
                Spacious
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sidebar">Sidebar Position</Label>
          <RadioGroup
            value={sidebarPosition}
            onValueChange={handleSidebarChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="left" id="sidebar-left" />
              <Label htmlFor="sidebar-left">Left</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="right" id="sidebar-right" />
              <Label htmlFor="sidebar-right">Right</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="collapsed" id="sidebar-collapsed" />
              <Label htmlFor="sidebar-collapsed">Collapsed</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
