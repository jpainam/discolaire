"use client";

import { useState, ViewTransition } from "react";
import { DM_Sans } from "next/font/google";
import Image from "next/image";

import {
  BarChart3,
  ChevronDown,
  ExternalLink,
  Flame,
  Globe,
  MapPin,
  Sparkles,
  Tags,
  TrendingUp,
  Users,
} from "lucide-react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

function TrendLine({ dark = false }: { dark?: boolean }) {
  return (
    <svg className="h-6 w-20" viewBox="0 0 80 24" fill="none">
      <path
        d="M2 18 L15 16 L25 17 L40 14 L55 12 L65 8 L78 6"
        stroke={dark ? "#4ade80" : "#22c55e"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// Light mode card
function CompanyCardLight() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-zinc-200/80 bg-[#f8f8f8] shadow-sm transition-all duration-300 ${
        expanded ? "shadow-lg shadow-zinc-200/50" : "hover:shadow-md"
      }`}
    >
      <div
        className="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-zinc-100/50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
            <Image
              src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/claude-ai-icon.svg"
              alt="Claude"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </div>
          <span className="font-medium text-zinc-900">Claude</span>
        </div>
        <div className="flex items-center gap-3">
          <TrendLine />
          <ChevronDown
            className={`h-5 w-5 text-zinc-400 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 rounded-t-2xl border-t border-zinc-300 bg-white px-5 py-5">
            <InfoRowLight
              icon={<Globe className="h-4 w-4" strokeWidth={1.5} />}
              label="Website"
              value={
                <a
                  href="http://claude.ai"
                  className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                  http://claude.ai
                </a>
              }
            />
            <InfoRowLight
              icon={<Sparkles className="h-4 w-4" strokeWidth={1.5} />}
              label="Monthly visits"
              value={<span className="text-zinc-900">216M</span>}
            />
            <InfoRowLight
              icon={<Flame className="h-4 w-4" strokeWidth={1.5} />}
              label="Heat Score"
              value={
                <span className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-0.5 text-sm font-medium text-green-700">
                  98
                  <TrendingUp className="h-3 w-3" strokeWidth={2} />
                </span>
              }
            />
            <InfoRowLight
              icon={<MapPin className="h-4 w-4" strokeWidth={1.5} />}
              label="Location"
              value={<span className="text-zinc-900">California, USA</span>}
            />
            <InfoRowLight
              icon={<Tags className="h-4 w-4" strokeWidth={1.5} />}
              label="Categories"
              value={
                <div className="flex gap-1.5">
                  {["AI", "SaaS", "B2B"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              }
            />
            <InfoRowLight
              icon={<Users className="h-4 w-4" strokeWidth={1.5} />}
              label="Employees"
              value={<span className="text-zinc-900">1001-5000</span>}
            />
            <InfoRowLight
              icon={<BarChart3 className="h-4 w-4" strokeWidth={1.5} />}
              label="Estimated ARR"
              value={
                <span className="rounded-md bg-green-50 px-2 py-0.5 text-sm font-medium text-green-700">
                  $3-4B
                </span>
              }
            />
            <InfoRowLight
              icon={<TrendingUp className="h-4 w-4" strokeWidth={1.5} />}
              label="Founders"
              value={
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 overflow-hidden rounded-full bg-zinc-200">
                      <Image
                        src="https://assets.stickpng.com/images/68446faef46e60b40c392760.png"
                        alt="Dario Amodei"
                        width={20}
                        height={20}
                        className="h-5 w-5 object-cover"
                      />
                    </div>
                    <span className="text-sm text-zinc-900">Dario Amodei</span>
                  </div>
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-500">
                    +5
                  </span>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Dark mode card
function CompanyCardDark() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-800 shadow-sm transition-all duration-300 ${
        expanded ? "shadow-lg shadow-black/30" : "hover:shadow-md"
      }`}
    >
      <div
        className="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-zinc-700/30"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
            <Image
              src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/claude-ai-icon.svg"
              alt="Claude"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </div>
          <span className="font-medium text-zinc-100">Claude</span>
        </div>
        <div className="flex items-center gap-3">
          <TrendLine dark />
          <ChevronDown
            className={`h-5 w-5 text-zinc-500 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 rounded-t-2xl border-t border-zinc-700 bg-zinc-900 px-5 py-5">
            <InfoRowDark
              icon={<Globe className="h-4 w-4" strokeWidth={1.5} />}
              label="Website"
              value={
                <a
                  href="http://claude.ai"
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
                  http://claude.ai
                </a>
              }
            />
            <InfoRowDark
              icon={<Sparkles className="h-4 w-4" strokeWidth={1.5} />}
              label="Monthly visits"
              value={<span className="text-zinc-100">216M</span>}
            />
            <InfoRowDark
              icon={<Flame className="h-4 w-4" strokeWidth={1.5} />}
              label="Heat Score"
              value={
                <span className="inline-flex items-center gap-1 rounded-md bg-green-900/50 px-2 py-0.5 text-sm font-medium text-green-400">
                  98
                  <TrendingUp className="h-3 w-3" strokeWidth={2} />
                </span>
              }
            />
            <InfoRowDark
              icon={<MapPin className="h-4 w-4" strokeWidth={1.5} />}
              label="Location"
              value={<span className="text-zinc-100">California, USA</span>}
            />
            <InfoRowDark
              icon={<Tags className="h-4 w-4" strokeWidth={1.5} />}
              label="Categories"
              value={
                <div className="flex gap-1.5">
                  {["AI", "SaaS", "B2B"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              }
            />
            <InfoRowDark
              icon={<Users className="h-4 w-4" strokeWidth={1.5} />}
              label="Employees"
              value={<span className="text-zinc-100">1001-5000</span>}
            />
            <InfoRowDark
              icon={<BarChart3 className="h-4 w-4" strokeWidth={1.5} />}
              label="Estimated ARR"
              value={
                <span className="rounded-md bg-green-900/50 px-2 py-0.5 text-sm font-medium text-green-400">
                  $3-4B
                </span>
              }
            />
            <InfoRowDark
              icon={<TrendingUp className="h-4 w-4" strokeWidth={1.5} />}
              label="Founders"
              value={
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 overflow-hidden rounded-full bg-zinc-700">
                      <Image
                        src="https://assets.stickpng.com/images/68446faef46e60b40c392760.png"
                        alt="Dario Amodei"
                        width={20}
                        height={20}
                        className="h-5 w-5 object-cover"
                      />
                    </div>
                    <span className="text-sm text-zinc-100">Dario Amodei</span>
                  </div>
                  <span className="rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-xs font-medium text-zinc-400">
                    +5
                  </span>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRowLight({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-zinc-400">{icon}</span>
      <span className="w-32 text-sm text-zinc-500">{label}</span>
      <div className="flex-1">{value}</div>
    </div>
  );
}

function InfoRowDark({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-zinc-500">{icon}</span>
      <span className="w-32 text-sm text-zinc-500">{label}</span>
      <div className="flex-1">{value}</div>
    </div>
  );
}

export default function CompanyCardPage() {
  return (
    <div className={`min-h-screen ${dmSans.className}`}>
      

      {/* Split layout */}
      <div className="flex min-h-screen flex-col pt-[57px] md:flex-row">
        {/* Light mode side */}
        <ViewTransition name="company-card-light-panel">
          <div className="relative flex-1 bg-[#f5f5f5]">
            {/* Light dot grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #d4d4d4 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex min-h-[calc(100vh-57px)] flex-col items-center justify-center p-6 md:p-12">
              <ViewTransition name="company-card-light">
                <div className="w-full max-w-md">
                  <CompanyCardLight />
                </div>
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>

        {/* Dark mode side */}
        <ViewTransition name="company-card-dark-panel">
          <div className="relative flex-1 bg-zinc-950">
            {/* Dark dot grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle, #3f3f46 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 flex min-h-[calc(100vh-57px)] flex-col items-center justify-center p-6 md:p-12">
              <ViewTransition name="company-card-dark">
                <div className="w-full max-w-md">
                  <CompanyCardDark />
                </div>
              </ViewTransition>
            </div>
          </div>
        </ViewTransition>
      </div>
    </div>
  );
}
