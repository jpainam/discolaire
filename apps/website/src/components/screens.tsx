"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@repo/ui/lib/utils";

export function Screens() {
  const [activeTab, setActiveTab] = useState(0);

  const screens = [
    {
      id: 1,
      name: "Overview",
      src: "/student-list.png",
      alt: "Dashboard - Overview",
      description: "Vue d'ensemble des étudiants et de leurs informations",
    },
    {
      id: 2,
      name: "Tracker",
      src: "/student-details.png",
      alt: "Dashboard - Tracker",
      description: "Suivez les détails et la progression de chaque étudiant",
    },
    {
      id: 3,
      name: "Inbox",
      src: "/classroom-details.png",
      alt: "Dashboard - Inbox",
      description: "Gérez les détails de chaque salle de classe",
    },
    {
      id: 4,
      name: "Vault",
      src: "/classroom-list.png",
      alt: "Dashboard - Vault",
      description: "Visualisez toutes les salles de classe en un coup d'œil",
    },
    {
      id: 5,
      name: "Transactions",
      src: "/classroom-subjects.png",
      alt: "Dashboard - Transactions",
      description: "Organisez les matières par salle de classe",
    },
  ];

  return (
    <div className="relative mt-[50px] pb-24 pt-12 md:mt-[120px]">
      <div className="relative z-10 flex flex-col items-center">
        <div className="pb-16 text-center">
          <h3 className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-4xl font-medium text-transparent md:text-6xl">
            Interface optimisé
          </h3>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg">
            Optimisez la gestion de votre école, simplifiez l'éducation.
          </p>
        </div>

        {/* Interactive Tabbed Showcase */}
        <div className="mx-auto w-full max-w-[1280px] px-4">
          {/* Tabs */}
          <div className="mb-8 flex flex-wrap justify-center gap-2 md:gap-4">
            {screens.map((screen, index) => (
              <button
                key={screen.id}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 md:px-6 md:py-3 md:text-base",
                  activeTab === index
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {screen.name}
              </button>
            ))}
          </div>

          {/* Device Frame with Screenshot */}
          <div className="relative mx-auto max-w-5xl">
            {/* Laptop Frame */}
            <div className="relative aspect-[16/10] w-full rounded-t-xl bg-zinc-900 p-[3%] pt-[2%] shadow-2xl">
              {/* Screen Content */}
              <div className="relative h-full w-full overflow-hidden rounded-md bg-white">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={screens[activeTab]?.src ?? "/placeholder.svg"}
                      alt={screens[activeTab]?.alt ?? "Placeholder description"}
                      fill
                      className="object-cover"
                      quality={100}
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Laptop Base */}
            <div className="relative -left-[2.5%] h-[3.5%] w-[105%] rounded-b-lg bg-zinc-800"></div>
            <div className="relative -left-[5%] h-[1%] w-[110%] rounded-b-lg bg-zinc-700"></div>

            {/* Feature Description */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-8 text-center"
            >
              {screens[activeTab] && (
                <h4 className="text-primary text-xl font-medium md:text-2xl">
                  {screens[activeTab].name}
                </h4>
              )}
              {screens[activeTab] && (
                <p className="text-muted-foreground mt-2">
                  {screens[activeTab].description}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
