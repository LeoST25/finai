import { Activity, AlertTriangle, CheckCircle2, Info, Sparkles } from 'lucide-react';
import type { OfficeLogEntry } from '../types/office';

interface OfficeActivityFeedProps {
  logs: OfficeLogEntry[];
}

const iconByType = {
  info: <Info className="h-4 w-4 text-slate-400" />,
  action: <Sparkles className="h-4 w-4 text-indigo-500" />,
  alert: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
};

export function OfficeActivityFeed({ logs }: OfficeActivityFeedProps) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-600" />
          <h2 className="text-sm font-semibold text-slate-900">Atividade recente</h2>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {logs.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhuma atividade registrada.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
                {iconByType[log.type]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800">{log.message}</p>
                {log.timestamp && (
                  <time className="mt-1 block text-xs text-slate-400">{log.timestamp}</time>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}