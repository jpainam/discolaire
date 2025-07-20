"use client";

import { useState } from "react";
import { BarChart, HelpCircle, Menu, Settings, Users } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { cn } from "@repo/ui/lib/utils";

export default function Dashboard() {
  const [activeSidePanel, setActiveSidePanel] = useState<string | null>(null);

  const toggleSidePanel = (panelId: string) => {
    setActiveSidePanel(activeSidePanel === panelId ? null : panelId);
  };

  const panels = [
    { id: "panel1", label: "Panel 1", icon: BarChart },
    { id: "panel2", label: "Panel 2", icon: Users },
    { id: "panel3", label: "Panel 3", icon: Settings },
    { id: "panel4", label: "Panel 4", icon: HelpCircle },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Sidebar */}
      <div className="bg-background flex w-64 flex-col border-r">
        <div className="flex h-14 items-center border-b px-4">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>
        <ScrollArea className="flex-1">
          <nav className="space-y-1 p-2">
            {[
              { icon: BarChart, label: "Analytics" },
              { icon: Users, label: "Users" },
              { icon: Settings, label: "Settings" },
              { icon: HelpCircle, label: "Help" },
            ].map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center border-b px-4">
          <Button variant="outline" size="icon" className="mr-2">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <h2 className="text-lg font-semibold">Main Content</h2>
        </header>

        {/* Content Area with Flexible Layout */}
        <div className="relative flex flex-1 overflow-hidden">
          {/* Main Content Scrollable Area - Resizes when panel opens */}
          <ScrollArea
            className={cn(
              "transition-all duration-300 ease-in-out",
              activeSidePanel ? "w-[calc(100%-25%)]" : "w-full",
            )}
          >
            <div className="space-y-4 p-4">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 text-lg font-medium">
                  Welcome to Dashboard
                </h3>
                <p>
                  This is the main content area. Click on the buttons on the
                  right to open side panels.
                </p>
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <h3 className="mb-2 text-lg font-medium">
                    Content Section {i + 1}
                  </h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Right Side Panel with Buttons */}
          <div
            className={cn(
              "absolute inset-y-0 right-0 flex transition-transform duration-300 ease-in-out",
              activeSidePanel
                ? "translate-x-0"
                : "translate-x-[calc(100%-3.5rem)]",
            )}
          >
            {/* Buttons Column */}
            <div className="bg-background flex w-14 flex-col border-l">
              <div className="flex flex-col items-center space-y-4 p-2">
                {panels.map((panel) => (
                  <Button
                    key={panel.id}
                    variant={
                      activeSidePanel === panel.id ? "default" : "outline"
                    }
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => toggleSidePanel(panel.id)}
                  >
                    <span className="sr-only">{panel.label}</span>
                    <panel.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Panel Content */}
            <div
              className={cn(
                "bg-background border-l transition-all duration-300 ease-in-out",
                activeSidePanel
                  ? "w-[calc(25%-3.5rem)] opacity-100"
                  : "w-0 overflow-hidden opacity-0",
              )}
            >
              {activeSidePanel && (
                <>
                  <div className="flex h-14 items-center border-b px-4">
                    <h3 className="text-lg font-semibold">
                      {panels.find((p) => p.id === activeSidePanel)?.label}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto"
                      onClick={() => setActiveSidePanel(null)}
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </Button>
                  </div>
                  <ScrollArea className="h-[calc(100%-3.5rem)]">
                    <div className="p-4">
                      {activeSidePanel === "panel1" && (
                        <div className="space-y-4">
                          <h4 className="font-medium">Panel 1 Content</h4>
                          <p>This is the content for Panel 1.</p>
                        </div>
                      )}
                      {activeSidePanel === "panel2" && (
                        <div className="space-y-4">
                          <h4 className="font-medium">Panel 2 Content</h4>
                          <p>This is the content for Panel 2.</p>
                        </div>
                      )}
                      {activeSidePanel === "panel3" && (
                        <div className="space-y-4">
                          <h4 className="font-medium">Panel 3 Content</h4>
                          <p>This is the content for Panel 3.</p>
                        </div>
                      )}
                      {activeSidePanel === "panel4" && (
                        <div className="space-y-4">
                          <h4 className="font-medium">Panel 4 Content</h4>
                          <p>This is the content for Panel 4.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
