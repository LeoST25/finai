export type GoalAlertType =
  | "warning"
  | "danger"
  | "success"
  | "info";

  export type GoalAlertCode =
  | "near-limit"
  | "limit-exceeded"
  | "goal-completed"
  | "near-completion";

export type GoalAlert = {
  id: string;
  goalId: string;
  title: string;
  description: string;
  type: GoalAlertType;
  code: GoalAlertCode;
};