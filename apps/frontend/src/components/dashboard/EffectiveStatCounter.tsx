"use client";

import CountUp from "react-countup";

export function EffectiveStatCounter({
  amount,
  duration,
}: {
  amount: number;
  duration: number;
}) {
  return <CountUp end={amount} duration={duration} />;
}
