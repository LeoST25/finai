import { DashboardKpis } from "../components/dashboard-kpis";
import { getDashboardSummary } from "../dashboard-summary";

type Props = {
  summary: ReturnType<typeof getDashboardSummary>;
};

export function DashboardKpisWidget({ summary }: Props) {
  return <DashboardKpis summary={summary} />;
}