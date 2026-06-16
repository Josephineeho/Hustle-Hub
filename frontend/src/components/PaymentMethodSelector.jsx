"use client";

import { useState } from "react";
import { Smartphone, CreditCard, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  smartphone: Smartphone,
  payments: CreditCard,
  account_balance_wallet: Banknote,
};

export default function PaymentMethodSelector({ methods, onChange }) {
  const [selected, setSelected] = useState(methods[0]?.id ?? "");

  function handleSelect(id) {
    setSelected(id);
    onChange?.(id);
  }

  return (
    <div className="flex flex-col gap-3">
      {methods.map((method) => {
        const isSelected = selected === method.id;
        const IconComponent = ICON_MAP[method.icon] || Banknote; // Fallback to Banknote
        
        return (
          <button
            key={method.id}
            type="button"
            onClick={() => handleSelect(method.id)}
            aria-pressed={isSelected}
            className={cn(
              "relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left cursor-pointer hover:bg-gray-50 focus:outline-none",
              isSelected
                ? "border-(--color-primary) ring-1 ring-(--color-primary) bg-blue-50/30"
                : "border-(--color-outline-variant)/50"
            )}
          >
            <div
              className={cn(
                "p-2.5 rounded-lg transition-colors",
                isSelected
                  ? "bg-(--color-primary) text-white"
                  : "bg-blue-50 text-(--color-primary)"
              )}
            >
              <IconComponent className="w-5 h-5" />
            </div>

            <div className="flex flex-col flex-1">
              <span className="font-semibold text-(--color-on-background)">{method.label}</span>
              <span className="text-xs text-(--color-on-surface-variant) mt-0.5">
                {method.detail}
              </span>
            </div>

            {/* Radio dot */}
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                isSelected ? "border-(--color-primary) bg-(--color-primary)" : "border-(--color-outline-variant)"
              )}
            >
              {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </button>
        );
      })}
    </div>
  );
}