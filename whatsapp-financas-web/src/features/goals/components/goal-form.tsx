import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { PiggyBank, Save, ShieldCheck, Target } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateGoal, useUpdateGoal } from '@/features/goals/hooks';
import {
  goalFormSchema,
  normalizeCurrencyValue,
  type GoalFormData,
} from '@/features/goals/schemas';
import type { FinancialGoal, GoalType } from '@/features/goals/types';
import { cn } from '@/lib/utils';

type GoalFormProps = {
  mode?: 'create' | 'edit';
  goal?: FinancialGoal;
  onSuccess?: () => void;
};

const savingsCategories = [
  'Reserva de emergência',
  'Viagem',
  'Educação',
  'Investimentos',
  'Compra planejada',
  'Aposentadoria',
  'Outros',
];

const expenseLimitCategories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Assinaturas',
  'Outros',
];

function formatValueForInput(value?: number): string {
  if (value === undefined) {
    return '';
  }

  return String(value).replace('.', ',');
}

function getDefaultValues(goal?: FinancialGoal): GoalFormData {
  return {
    title: goal?.title ?? '',
    description: goal?.description ?? '',
    category: goal?.category ?? '',
    type: goal?.type ?? 'savings',
    targetAmount: formatValueForInput(goal?.targetAmount),
    currentAmount: formatValueForInput(goal?.currentAmount),
    deadline: goal?.deadline ? goal.deadline.slice(0, 10) : '',
  };
}

export function GoalForm({ mode = 'create', goal, onSuccess }: GoalFormProps) {
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();

  const isEditMode = mode === 'edit' && goal !== undefined;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: getDefaultValues(goal),
  });

  const selectedType = useWatch({
    control,
    name: 'type',
  });

  const selectedCategory = useWatch({
    control,
    name: 'category',
  });

  const baseCategories =
    selectedType === 'savings' ? savingsCategories : expenseLimitCategories;

  const categories =
    selectedCategory && !baseCategories.includes(selectedCategory)
      ? [selectedCategory, ...baseCategories]
      : baseCategories;

  const isPending = createGoal.isPending || updateGoal.isPending;

  useEffect(() => {
    reset(getDefaultValues(goal));
  }, [goal, reset]);

  function handleTypeChange(type: GoalType): void {
    setValue('type', type, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (type !== selectedType) {
      setValue('category', '', {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }

  function onSubmit(data: GoalFormData): void {
    const payload = {
      title: data.title.trim(),
      description: data.description.trim() || undefined,
      category: data.category,
      type: data.type,
      targetAmount: normalizeCurrencyValue(data.targetAmount),
      currentAmount: data.currentAmount
        ? normalizeCurrencyValue(data.currentAmount)
        : 0,
      deadline: data.deadline || undefined,
    };

    if (isEditMode) {
      updateGoal.mutate(
        {
          id: goal.id,
          ...payload,
        },
        {
          onSuccess: () => {
            toast.success('Meta atualizada com sucesso.');

            onSuccess?.();
          },

          onError: (error) => {
            console.error('Erro ao atualizar meta:', error);

            toast.error('Não foi possível atualizar a meta.');
          },
        },
      );

      return;
    }

    createGoal.mutate(payload, {
      onSuccess: () => {
        toast.success('Meta criada com sucesso.');

        reset(getDefaultValues());

        onSuccess?.();
      },

      onError: (error) => {
        console.error('Erro ao criar meta:', error);

        toast.error('Não foi possível criar a meta.');
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleTypeChange('savings')}
          className={cn(
            'rounded-xl border p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50',
            selectedType === 'savings' &&
              'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-200',
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500',
                selectedType === 'savings' && 'bg-emerald-100 text-emerald-700',
              )}
            >
              <PiggyBank className="size-5" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">Meta de economia</p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Junte dinheiro para alcançar um objetivo.
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleTypeChange('expense-limit')}
          className={cn(
            'rounded-xl border p-4 text-left transition hover:border-amber-200 hover:bg-amber-50',
            selectedType === 'expense-limit' &&
              'border-amber-300 bg-amber-50 ring-1 ring-amber-200',
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500',
                selectedType === 'expense-limit' &&
                  'bg-amber-100 text-amber-700',
              )}
            >
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <p className="font-semibold text-slate-900">Limite de despesas</p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Controle quanto pode gastar em uma categoria.
              </p>
            </div>
          </div>
        </button>
      </div>

      {errors.type && (
        <p className="text-xs text-red-500">{errors.type.message}</p>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="goal-title"
          className="text-sm font-medium text-slate-700"
        >
          Título
        </label>

        <Input
          id="goal-title"
          placeholder={
            selectedType === 'savings'
              ? 'Ex: Reserva de emergência'
              : 'Ex: Limite de alimentação'
          }
          {...register('title')}
        />

        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="goal-description"
          className="text-sm font-medium text-slate-700"
        >
          Descrição
          <span className="ml-1 font-normal text-slate-400">opcional</span>
        </label>

        <textarea
          id="goal-description"
          rows={3}
          maxLength={500}
          placeholder="Descreva o objetivo desta meta..."
          className="flex min-h-20 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          {...register('description')}
        />

        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="goal-category"
          className="text-sm font-medium text-slate-700"
        >
          Categoria
        </label>

        <select
          id="goal-category"
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          {...register('category')}
        >
          <option value="">Selecione uma categoria</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {errors.category && (
          <p className="text-xs text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="goal-target-amount"
            className="text-sm font-medium text-slate-700"
          >
            {selectedType === 'savings' ? 'Valor objetivo' : 'Limite máximo'}
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              R$
            </span>

            <Input
              id="goal-target-amount"
              inputMode="decimal"
              placeholder="0,00"
              className="pl-10"
              {...register('targetAmount')}
            />
          </div>

          {errors.targetAmount && (
            <p className="text-xs text-red-500">
              {errors.targetAmount.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="goal-current-amount"
            className="text-sm font-medium text-slate-700"
          >
            {selectedType === 'savings'
              ? 'Valor já acumulado'
              : 'Valor já utilizado'}
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              R$
            </span>

            <Input
              id="goal-current-amount"
              inputMode="decimal"
              placeholder="0,00"
              className="pl-10"
              {...register('currentAmount')}
            />
          </div>

          {errors.currentAmount && (
            <p className="text-xs text-red-500">
              {errors.currentAmount.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="goal-deadline"
          className="text-sm font-medium text-slate-700"
        >
          Prazo
          <span className="ml-1 font-normal text-slate-400">opcional</span>
        </label>

        <Input id="goal-deadline" type="date" {...register('deadline')} />

        <p className="text-xs text-slate-500">
          Defina uma data para acompanhar o ritmo necessário.
        </p>

        {errors.deadline && (
          <p className="text-xs text-red-500">{errors.deadline.message}</p>
        )}
      </div>

      <div className="rounded-xl border bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <Target className="mt-0.5 size-5 shrink-0 text-slate-500" />

          <p className="text-xs leading-5 text-slate-600">
            {selectedType === 'savings'
              ? 'O FinAI acompanhará quanto falta para atingir o objetivo e poderá gerar alertas conforme o prazo.'
              : 'O FinAI avisará quando os gastos se aproximarem ou ultrapassarem o limite definido.'}
          </p>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending || (isEditMode && !isDirty)}
        className="w-full"
      >
        {isEditMode ? (
          <Save className="mr-2 size-4" />
        ) : (
          <Target className="mr-2 size-4" />
        )}

        {isPending
          ? isEditMode
            ? 'Salvando...'
            : 'Criando...'
          : isEditMode
            ? 'Salvar alterações'
            : 'Criar meta'}
      </Button>
    </form>
  );
}
