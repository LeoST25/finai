import { AppLayout } from "@/components/layout/AppLayout";
import { ErrorState } from "@/components/feedback/error-state";
import { Section } from "@/shared/ui";

import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { getDashboardSummary } from "@/features/dashboard/dashboard-summary";

import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DashboardKpis } from "@/features/dashboard/components/dashboard-kpis";
import { AiInsights } from "@/features/dashboard/components/ai-insights";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { DashboardSkeleton } from "@/features/dashboard/components/dashboard-skeleton";
import { LatestTransactions } from "@/features/dashboard/components/latest-transactions";
import { CategoryChart } from "@/features/dashboard/components/category-chart";
import { MonthlyChart } from "@/features/dashboard/components/monthly-chart";

import { CreateExpenseForm } from "@/features/expenses/components/create-expense-form";

export function Dashboard() {
  const { data = [], isLoading, error } = useExpenses();

  const summary = getDashboardSummary(data);

  if (isLoading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <ErrorState />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Section>
        <DashboardHeader
          user={{
            name: "Leonardo",
          }}
        />

        <DashboardKpis summary={summary} />

        <AiInsights expenses={data} />

        <QuickActions />

        <CreateExpenseForm />

        <LatestTransactions expenses={data} />

        <div className="grid gap-4 lg:grid-cols-2">
          <CategoryChart expenses={data} />
          <MonthlyChart expenses={data} />
        </div>
      </Section>
    </AppLayout>
  );
}