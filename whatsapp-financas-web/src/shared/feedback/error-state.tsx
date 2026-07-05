import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  description?: string;
};

export function ErrorState({
  title = "Não foi possível carregar os dados",
  description = "Verifique se a API está rodando e tente novamente.",
}: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-red-600">{description}</p>
        </div>
      </div>
    </div>
  );
}