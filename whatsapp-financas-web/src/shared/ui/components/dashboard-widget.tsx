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
};

export function DashboardWidget({
  title,
  description,
  action,
  children,
  className,
}: DashboardWidgetProps) {
  return (
    <Card
      className={cn(
        "rounded-2xl border shadow-sm transition-all hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between border-b px-6 py-5">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>

          {description && (
            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          )}
        </div>

        {action ?? (
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="p-6">{children}</div>
    </Card>
  );
}