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

import {
  changeLocaleAction,
  changeScaledThemeAction,
} from "~/actions/change_locale";
//import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
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
} from "~/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Kbd } from "~/components/ui/kbd";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
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
                <div className="flex size-7 items-center justify-center rounded-sm bg-linear-to-br from-purple-500 to-pink-600 text-xs font-semibold text-white shadow">
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
            <DropdownMenuItem asChild>
              <ThemeSelector />
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
      <SidebarMenuItem>
        <InputGroup className="h-7">
          <InputGroupInput placeholder={t("search")} />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </InputGroupAddon>
        </InputGroup>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
