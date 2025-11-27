import { useCallback } from "react";
import {
  ChevronDown,
  ComputerIcon,
  MoonIcon,
  Search,
  SunIcon,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";

//import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@repo/ui/components/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import { Kbd } from "@repo/ui/components/kbd";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@repo/ui/components/sidebar";

import {
  changeLocaleAction,
  changeScaledThemeAction,
} from "~/actions/change_locale";
import { META_THEME_COLORS, useMetaColor } from "~/hooks/use-meta-color";
import { useRouter } from "~/hooks/use-router";
import { ThemeSelector } from "./ThemeSelector";

export function SidebarLogo() {
  const { isMobile } = useSidebar();
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { setTheme } = useTheme();
  const { setMetaColor } = useMetaColor();

  const onChangeLanguage = async (value: string) => {
    const nextLocale = value;
    await changeLocaleAction(nextLocale);
    router.refresh();
  };

  const toggleTheme = useCallback(
    (mode: string) => {
      setTheme(mode);
      setMetaColor(
        mode === "dark" ? META_THEME_COLORS.light : META_THEME_COLORS.dark,
      );
    },
    [setTheme, setMetaColor],
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-sm bg-linear-to-br from-purple-500 to-pink-600 text-xs font-semibold text-white shadow">
                  DI
                </div>
                <span className="font-semibold">Discolaire</span>
              </div>

              <ChevronDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          >
            <DropdownMenuLabel>{t("Appearance")}</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <ThemeSelector />
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toggleTheme("dark")}>
              <MoonIcon />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toggleTheme("light")}>
              <SunIcon />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toggleTheme("system")}>
              <ComputerIcon />
              Sytem
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Zoom</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={async () => {
                document.body.classList.remove("theme-scaled");
                await changeScaledThemeAction(false);
              }}
            >
              <ZoomIn />
              100%
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={async () => {
                document.body.classList.add("theme-scaled");
                await changeScaledThemeAction(true);
              }}
            >
              <ZoomOut />
              80%
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="mr-2">
                  {locale == "fr" ? "🇫🇷" : locale == "en" ? "🇺🇸" : "🇪🇸"}
                </span>

                <span>{t("language")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={locale}
                    onValueChange={onChangeLanguage}
                  >
                    <DropdownMenuRadioItem value="fr">
                      {t("french")}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="en">
                      {t("english")}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="es">
                      {t("spanish")}
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <div className="relative mt-4">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Search..."
          className="text-muted-foreground placeholder:text-muted-foreground bg-background h-8 pr-8 pl-8 text-sm tracking-[-0.42px]"
        />
        <div className="border-border bg-sidebar absolute top-1/2 right-2 flex shrink-0 -translate-y-1/2 items-center gap-0.5 rounded border px-1.5 py-0.5">
          <span className="text-muted-foreground text-[10px] leading-none font-medium tracking-[-0.1px]">
            ⌘
          </span>
          <Kbd className="h-auto min-w-0 border-0 bg-transparent px-0 py-0 text-[10px] leading-none tracking-[-0.1px]">
            K
          </Kbd>
        </div>
      </div>
    </SidebarMenu>
  );
}
