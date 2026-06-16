"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const RATING_LABELS = ["Terrible", "Poor", "Average", "Great", "Exceptional!"];

export default function StarRating({ onChange }) {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(0);

  const active = hovered || selected;

  function handleClick(val) {
    setSelected(val);
    onChange?.(val);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => handleClick(val)}
            onMouseEnter={() => setHovered(val)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`Rate ${val} star${val > 1 ? "s" : ""}`}
            className="transition-transform duration-150 hover:scale-125 focus:outline-none rounded-full p-1"
          >
            <Star 
              className={cn(
                "w-12 h-12 transition-colors duration-150",
                val <= active ? "fill-amber-400 text-amber-400" : "text-(--color-outline-variant)"
              )} 
            />
          </button>
        ))}
      </div>

      <span
        className={cn(
          "text-sm font-semibold transition-all duration-200",
          selected > 0 ? "text-(--color-secondary)" : "text-(--color-on-surface-variant)"
        )}
      >
        {selected > 0 ? RATING_LABELS[selected - 1] : "Select a star rating"}
      </span>
    </div>
  );
}