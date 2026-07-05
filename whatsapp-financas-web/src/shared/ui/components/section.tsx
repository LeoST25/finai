import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function Section({
  children,
}: Props) {
  return (
    <section className="space-y-6">
      {children}
    </section>
  );
}