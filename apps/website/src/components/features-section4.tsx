/* eslint-disable @typescript-eslint/no-explicit-any */
import { useId } from "react";

export function FeaturesSection4() {
  return (
    <div className="py-20 lg:py-10">
      {/* Heading Section */}
      <div className="mb-10 text-center">
        <h2 className="text-2xl uppercase italic">
          Explore DISCOLAIRE FEATURES BY SYSTEM
        </h2>
        <p className="mt-2 py-5 text-lg text-neutral-600 dark:text-neutral-400">
          Discolaire combines school management, student information, and
          learning management features into one powerful, <br />
          comprehensive, and affordable platform.
        </p>
      </div>

      {/* Centered Features Grid */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 justify-center gap-10 sm:grid-cols-2 md:grid-cols-3">
        {grid.map((feature) => (
          <div
            key={feature.title}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-100 to-white p-6 dark:from-neutral-900 dark:to-neutral-950"
          >
            <Grid size={20} />
            <p className="relative z-20 mb-4 bg-gradient-to-r from-green-500 to-purple-500 bg-clip-text text-base font-bold text-transparent">
              {feature.title}
            </p>
            <p className="relative z-20 mt-4 text-base font-normal text-neutral-600 dark:text-neutral-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-10 mt-2 flex justify-center py-5 text-center text-lg text-neutral-600 dark:text-neutral-400">
        <p>
          Want to learn more? Dive into our extensive collection of guides
          covering a wide array of topics, providing in-depth insights and{" "}
          <br />
          practical advice.{" "}
        </p>
      </div>
    </div>
  );
}

const grid = [
  {
    title: "SCHOOL MANAGEMENT",
    description:
      "With DISCOLAIRE, administrators have access to a range of proactive features that contribute to streamlining school operations.",
  },
  {
    title: "LEARNING MANAGEMENT",
    description:
      "Transform your classroom experience with powerful and user-friendly Learning Management Features.",
  },
  {
    title: "STUDENT INFORMATION",
    description:
      "Tired of manual data entry? Embrace a new era in school data management with the ClassReach Student Information System Features.",
  },
];

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-100/30 to-zinc-300/30 opacity-100 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 dark:to-zinc-900/30">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full fill-black/10 stroke-black/10 mix-blend-overlay dark:fill-white/10 dark:stroke-white/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any, index: number) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}-${index}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
