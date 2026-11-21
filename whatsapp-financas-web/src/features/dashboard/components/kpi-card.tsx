import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "danger" | "warning";
};

const variants = {
  default: {
    container:
      "bg-white transition-all duration-300 sm:hover:-translate-y-1 sm:hover:shadow-lg",
    icon: "bg-slate-100 text-slate-700",
    value: "text-slate-900",
    trend: "text-slate-500",
  },
  success: {
    container:
      "border-emerald-100 bg-emerald-50 transition-all duration-300 sm:hover:-translate-y-1 sm:hover:shadow-lg",
    icon: "bg-emerald-100 text-emerald-700",
    value: "text-emerald-700",
    trend: "text-emerald-600",
  },
  danger: {
    container:
      "border-red-100 bg-red-50 transition-all duration-300 sm:hover:-translate-y-1 sm:hover:shadow-lg",
    icon: "bg-red-100 text-red-700",
    value: "text-red-700",
    trend: "text-red-600",
  },
  warning: {
    container:
      "border-amber-100 bg-amber-50 transition-all duration-300 sm:hover:-translate-y-1 sm:hover:shadow-lg",
    icon: "bg-amber-100 text-amber-700",
    value: "text-amber-700",
    trend: "text-amber-600",
  },
};

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
}: KpiCardProps) {
  const style = variants[variant];

  const TrendIcon =
    variant === "danger" ? ArrowDownRight : ArrowUpRight;

  return (
    <Card className={cn("overflow-hidden border", style.container)}>
      <CardContent className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2 sm:space-y-3">
            <p className="text-sm font-medium text-slate-500">
              {title}
            </p>

            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  "truncate text-2xl font-bold tracking-tight sm:text-3xl",
                  style.value,
                )}
              >
                {value}
              </h3>

              <TrendIcon
                className={cn("h-4 w-4 shrink-0 sm:h-5 sm:w-5", style.trend)}
              />
            </div>

            <p className="text-xs leading-relaxed text-slate-500">
              {description}
            </p>
          </div>

          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12",
              style.icon,
            )}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}