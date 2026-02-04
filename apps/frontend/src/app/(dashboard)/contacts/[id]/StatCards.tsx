import {
  MoreHorizontal,
  Pin,
  Settings,
  Share2,
  Trash,
  TriangleAlert,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const stats = [
  {
    title: "Nombre d'eleves",
    value: 2,
    delta: 0.2,
    lastMonth: 889100000,
    positive: true,
    prefix: "",
    suffix: "M",
    format: (v: number) => `$${(v / 1_000_000).toFixed(1)}M`,
    lastFormat: (v: number) => `$${(v / 1_000_000).toFixed(1)}M`,
    bg: "bg-zinc-950",
    svg: (
      <svg
        className="pointer-events-none absolute top-0 right-0 h-full w-2/3"
        viewBox="0 0 300 200"
        fill="none"
        style={{ zIndex: 0 }}
      >
        <circle cx="220" cy="100" r="90" fill="#fff" fillOpacity="0.08" />
        <circle cx="260" cy="60" r="60" fill="#fff" fillOpacity="0.10" />
        <circle cx="200" cy="160" r="50" fill="#fff" fillOpacity="0.07" />
        <circle cx="270" cy="150" r="30" fill="#fff" fillOpacity="0.12" />
      </svg>
    ),
  },
  {
    title: "New Customers",
    value: 12800,
    delta: 3.1,
    lastMonth: 12400,
    positive: true,
    prefix: "",
    suffix: "",
    bg: "bg-fuchsia-600",
    svg: (
      <svg
        className="pointer-events-none absolute top-0 right-0 h-48 w-48"
        viewBox="0 0 200 200"
        fill="none"
        style={{ zIndex: 0 }}
      >
        <defs>
          <filter id="blur2" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <ellipse
          cx="170"
          cy="60"
          rx="40"
          ry="18"
          fill="#fff"
          fillOpacity="0.13"
          filter="url(#blur2)"
        />
        <rect
          x="120"
          y="20"
          width="60"
          height="20"
          rx="8"
          fill="#fff"
          fillOpacity="0.10"
        />
        <polygon points="150,0 200,0 200,50" fill="#fff" fillOpacity="0.07" />
        <circle cx="180" cy="100" r="14" fill="#fff" fillOpacity="0.16" />
      </svg>
    ),
  },
  {
    title: "Refunds",
    value: 320,
    delta: -1.2,
    lastMonth: 340,
    positive: false,
    prefix: "",
    suffix: "",
    bg: "bg-blue-600",
    svg: (
      <svg
        className="pointer-events-none absolute top-0 right-0 h-48 w-48"
        viewBox="0 0 200 200"
        fill="none"
        style={{ zIndex: 0 }}
      >
        <defs>
          <filter id="blur3" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>
        <rect
          x="120"
          y="0"
          width="70"
          height="70"
          rx="35"
          fill="#fff"
          fillOpacity="0.09"
          filter="url(#blur3)"
        />
        <ellipse
          cx="170"
          cy="80"
          rx="28"
          ry="12"
          fill="#fff"
          fillOpacity="0.12"
        />
        <polygon points="200,0 200,60 140,0" fill="#fff" fillOpacity="0.07" />
        <circle cx="150" cy="30" r="10" fill="#fff" fillOpacity="0.15" />
      </svg>
    ),
  },
  {
    title: "Churn Rate",
    value: 2.3,
    delta: -0.1,
    lastMonth: 2.4,
    positive: false,
    prefix: "",
    suffix: "%",
    bg: "bg-teal-600",
    svg: (
      <svg
        className="pointer-events-none absolute top-0 right-0 h-48 w-48"
        viewBox="0 0 200 200"
        fill="none"
        style={{ zIndex: 0 }}
      >
        <defs>
          <filter id="blur4" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
        </defs>
        <polygon points="200,0 200,100 100,0" fill="#fff" fillOpacity="0.09" />
        <ellipse
          cx="170"
          cy="40"
          rx="30"
          ry="18"
          fill="#fff"
          fillOpacity="0.13"
          filter="url(#blur4)"
        />
        <rect
          x="140"
          y="60"
          width="40"
          height="18"
          rx="8"
          fill="#fff"
          fillOpacity="0.10"
        />
        <circle cx="150" cy="30" r="14" fill="#fff" fillOpacity="0.18" />
        <line
          x1="120"
          y1="0"
          x2="200"
          y2="80"
          stroke="#fff"
          strokeOpacity="0.08"
          strokeWidth="6"
        />
      </svg>
    ),
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 py-2 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden ${stat.bg} text-white`}
        >
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white/90">
              {stat.title}
            </CardTitle>
            <CardAction>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant={"ghost"}>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom">
                  <DropdownMenuItem>
                    <Settings /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <TriangleAlert /> Add Alert
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pin /> Pin to Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 /> Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <Trash /> Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2.5">
              <span className="text-2xl font-semibold tracking-tight">
                {stat.value}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
