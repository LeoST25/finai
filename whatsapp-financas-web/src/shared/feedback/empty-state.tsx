import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50 p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
        <Icon className="h-6 w-6 text-slate-500" />
      </div>

      <h3 className="text-base font-semibold text-slate-900">{title}</h3>

      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}