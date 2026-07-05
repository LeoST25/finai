import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type AlertDialogContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(
  null,
);

function useAlertDialog() {
  const context = React.useContext(AlertDialogContext);

  if (!context) {
    throw new Error("AlertDialog components must be used inside AlertDialog");
  }

  return context;
}

function AlertDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

type AlertDialogTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

function AlertDialogTrigger({
  children,
  asChild,
  onClick,
  ...props
}: AlertDialogTriggerProps) {
  const { setOpen } = useAlertDialog();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        setOpen(true);
      },
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        setOpen(true);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function AlertDialogContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open } = useAlertDialog();

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" />

      <div
        className={cn(
          "relative z-50 w-full max-w-lg rounded-lg border bg-white p-6 shadow-lg",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

function AlertDialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-lg font-semibold", className)} {...props} />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-500", className)} {...props} />
  );
}

function AlertDialogCancel({
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useAlertDialog();

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useAlertDialog();

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
};