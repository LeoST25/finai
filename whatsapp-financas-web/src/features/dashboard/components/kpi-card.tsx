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
      "bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
    icon: "bg-slate-100 text-slate-700",
    value: "text-slate-900",
    trend: "text-slate-500",
  },
  success: {
    container:
      "bg-emerald-50 border-emerald-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
    icon: "bg-emerald-100 text-emerald-700",
    value: "text-emerald-700",
    trend: "text-emerald-600",
  },
  danger: {
    container:
      "bg-red-50 border-red-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
    icon: "bg-red-100 text-red-700",
    value: "text-red-700",
    trend: "text-red-600",
  },
  warning: {
    container:
      "bg-amber-50 border-amber-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
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
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-500">
              {title}
            </p>

            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  "text-3xl font-bold tracking-tight",
                  style.value,
                )}
              >
                {value}
              </h3>

              <TrendIcon
                className={cn("h-5 w-5", style.trend)}
              />
            </div>

            <p className="text-xs text-slate-500">
              {description}
            </p>
          </div>

          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl",
              style.icon,
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}