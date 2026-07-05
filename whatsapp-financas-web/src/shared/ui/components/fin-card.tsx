import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FinCardProps = {
  title?: string;
  children: ReactNode;
};

export function FinCard({
  title,
  children,
}: FinCardProps) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}

      <CardContent>{children}</CardContent>
    </Card>
  );
}