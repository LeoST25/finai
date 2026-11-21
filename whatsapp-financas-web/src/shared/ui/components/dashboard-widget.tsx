import type { ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardWidgetProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function DashboardWidget({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: DashboardWidgetProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b px-4 py-4 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <h3 className="text-base font-semibold">{title}</h3>

          {description && (
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              {description}
            </p>
          )}
        </div>

        <div className="shrink-0">
          {action ?? (
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className={cn("p-4 sm:p-6", contentClassName)}>
        {children}
      </div>
    </Card>
  );
}