import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from "lucide-react";

import type {
  GoalAlert,
  GoalAlertType,
} from "@/features/goals/types";

type GoalAlertCardProps = {
  alert: GoalAlert;
};

function getAlertStyles(type: GoalAlertType) {
  const styles = {
    danger: {
      container: "border-red-200 bg-red-50",
      icon: "text-red-600",
      title: "text-red-900",
      description: "text-red-700",
    },
    warning: {
      container: "border-amber-200 bg-amber-50",
      icon: "text-amber-600",
      title: "text-amber-900",
      description: "text-amber-700",
    },
    success: {
      container: "border-emerald-200 bg-emerald-50",
      icon: "text-emerald-600",
      title: "text-emerald-900",
      description: "text-emerald-700",
    },
    info: {
      container: "border-blue-200 bg-blue-50",
      icon: "text-blue-600",
      title: "text-blue-900",
      description: "text-blue-700",
    },
  };

  return styles[type];
}

function AlertIcon({ type }: { type: GoalAlertType }) {
  const icons = {
    danger: AlertCircle,
    warning: TriangleAlert,
    success: CheckCircle2,
    info: Info,
  };

  const Icon = icons[type];

  return <Icon className="h-5 w-5" aria-hidden="true" />;
}

export function GoalAlertCard({ alert }: GoalAlertCardProps) {
  const styles = getAlertStyles(alert.type);

  return (
    <article
      className={`flex items-start gap-3 rounded-xl border p-4 ${styles.container}`}
    >
      <div className={`mt-0.5 shrink-0 ${styles.icon}`}>
        <AlertIcon type={alert.type} />
      </div>

      <div>
        <h3 className={`text-sm font-semibold ${styles.title}`}>
          {alert.title}
        </h3>

        <p className={`mt-1 text-sm ${styles.description}`}>
          {alert.description}
        </p>
      </div>
    </article>
  );
}