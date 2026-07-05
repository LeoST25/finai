import type { LucideIcon } from "lucide-react";

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
    container: "bg-white",
    icon: "bg-slate-100 text-slate-700",
    value: "text-slate-900",
  },
  success: {
    container: "bg-emerald-50 border-emerald-100",
    icon: "bg-emerald-100 text-emerald-700",
    value: "text-emerald-700",
  },
  danger: {
    container: "bg-red-50 border-red-100",
    icon: "bg-red-100 text-red-700",
    value: "text-red-700",
  },
  warning: {
    container: "bg-amber-50 border-amber-100",
    icon: "bg-amber-100 text-amber-700",
    value: "text-amber-700",
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

  return (
    <Card className={cn("overflow-hidden border shadow-sm", style.container)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">{title}</p>

            <p className={cn("text-2xl font-bold tracking-tight", style.value)}>
              {value}
            </p>

            <p className="text-xs text-slate-500">{description}</p>
          </div>

          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              style.icon,
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}