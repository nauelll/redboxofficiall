"use client";
import * as React from "react";
export function useCountdown(targetIso?: string) {
  const target = targetIso ? +new Date(targetIso) : 0;
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, done: true };
  const total = Math.max(0, target - now);
  const done = total === 0;
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total, done,
  };
}
