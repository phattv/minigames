"use client";

import { useEffect, useState } from "react";

const SIZES = [
  { label: "S", value: "75%" },
  { label: "M", value: "100%" },
  { label: "L", value: "125%" },
];

export function FontSizeControl() {
  const [current, setCurrent] = useState("125%");

  useEffect(() => {
    const saved = localStorage.getItem("fontSize") ?? "125%";
    setCurrent(saved);
    document.documentElement.style.fontSize = saved;
  }, []);

  const apply = (size: string) => {
    setCurrent(size);
    document.documentElement.style.fontSize = size;
    localStorage.setItem("fontSize", size);
  };

  return (
    <div className="flex items-center gap-1">
      Display:{" "}
      {SIZES.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => apply(value)}
          className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
            current === value
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
