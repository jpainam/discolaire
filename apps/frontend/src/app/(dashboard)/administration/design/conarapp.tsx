import {
  RiAddLine,
  RiDatabase2Line,
  RiDeleteBinLine,
  RiEditLine,
  RiEyeLine,
} from "@remixicon/react";

import { cn } from "~/lib/utils";

interface FeatureCardTitleProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

function FeatureCardTitle({
  title,
  description,
  icon,
  className,
}: FeatureCardTitleProps) {
  return (
    <header className={cn("flex flex-col", className)}>
      <h3 className="text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium tracking-wide">
        {icon}
        {title}
      </h3>
      <p className="text-foreground text-xl leading-7 font-semibold">
        {description}
      </p>
    </header>
  );
}

interface DataActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "green" | "blue" | "yellow" | "red";
}

function DataActionCard({
  icon,
  title,
  description,
  color,
}: DataActionCardProps) {
  const colorClasses = {
    green:
      "from-green-500/10 to-green-600/10 border-green-500/20 hover:border-green-500/40 text-green-700 dark:text-green-400",
    blue: "from-blue-500/10 to-blue-600/10 border-blue-500/20 hover:border-blue-500/40 text-blue-700 dark:text-blue-400",
    yellow:
      "from-yellow-500/10 to-yellow-600/10 border-yellow-500/20 hover:border-yellow-500/40 text-yellow-700 dark:text-yellow-400",
    red: "from-red-500/10 to-red-600/10 border-red-500/20 hover:border-red-500/40 text-red-700 dark:text-red-400",
  };

  const bgColorClasses = {
    green: "bg-green-500/20",
    blue: "bg-blue-500/20",
    yellow: "bg-yellow-500/20",
    red: "bg-red-500/20",
  };

  const iconColorClasses = {
    green: "text-green-600",
    blue: "text-blue-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  return (
    <div
      className={cn(
        "cursor-pointer rounded-lg border bg-gradient-to-br p-3 transition-all duration-300 hover:shadow-md sm:p-4",
        colorClasses[color],
      )}
    >
      <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
        <div
          className={cn(
            "flex size-6 flex-shrink-0 items-center justify-center rounded-md sm:size-7",
            bgColorClasses[color],
          )}
        >
          <div className={cn(iconColorClasses[color])} aria-hidden="true">
            {icon}
          </div>
        </div>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="text-muted-foreground text-xs leading-relaxed">
        {description}
      </div>
    </div>
  );
}
export function ManageData() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <FeatureCardTitle
        className="mb-6 sm:mb-8"
        title="Comprehensive Data Management"
        description="Manage your data with ease. Add, edit, and delete data with a few clicks."
        icon={<RiDatabase2Line className="size-4" aria-hidden="true" />}
      />
      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <DataActionCard
            icon={<RiAddLine className="size-3" />}
            title="Create"
            description="Add new records with form validation and real-time feedback"
            color="green"
          />
          <DataActionCard
            icon={<RiEyeLine className="size-3" />}
            title="View"
            description="Browse and search through data with advanced filtering"
            color="blue"
          />
          <DataActionCard
            icon={<RiEditLine className="size-3" />}
            title="Edit"
            description="Modify existing records inline with instant updates"
            color="yellow"
          />
          <DataActionCard
            icon={<RiDeleteBinLine className="size-3" />}
            title="Delete"
            description="Remove records with confirmation dialogs and undo support"
            color="red"
          />
        </div>
      </div>
      <div className="text-muted-foreground/70 mt-4 text-xs italic">
        * Some features coming in nearest releases
      </div>
    </div>
  );
}
