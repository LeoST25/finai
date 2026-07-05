import { AppLayout } from "@/shared/layout/AppLayout";

export function Reports() {
  return (
    <AppLayout>
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Relatórios</h2>
        <p className="text-slate-500">
          Analise padrões, categorias e tendências dos seus gastos.
        </p>
      </div>
    </AppLayout>
  );
}