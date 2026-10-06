import { type ReactElement, type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type TaskPropertyTriggerProps = {
  children: ReactNode;
  label: string;
  className?: string;
  canEdit: boolean;
  variant?: "pill" | "avatar";
  renderEditor: (trigger: ReactElement) => ReactNode;
};

const variantClassNames = {
  pill: "rounded-md border border-border/60 bg-muted/40 px-1.5 py-0.5 hover:border-border hover:bg-accent focus-visible:border-ring focus-visible:bg-accent aria-expanded:border-border aria-expanded:bg-accent",
  avatar:
    "rounded-full hover:ring-2 hover:ring-border aria-expanded:ring-2 aria-expanded:ring-border",
};

export default function TaskPropertyTrigger({
  children,
  label,
  className,
  canEdit,
  variant = "pill",
  renderEditor,
}: TaskPropertyTriggerProps) {
  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => {
    if (!canEdit) setHasOpened(false);
  }, [canEdit]);
  if (!canEdit) return <>{children}</>;

  const trigger = (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex max-w-full cursor-pointer items-center text-left transition-[scale] duration-150 ease-out motion-safe:active:not-focus-visible:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        variantClassNames[variant],
        className,
      )}
      onClick={hasOpened ? undefined : () => setHasOpened(true)}
    >
      {children}
    </button>
  );

  return (
    // Portal events also bubble through this boundary, not through the card.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events -- event boundary; the child button handles keyboard activation
    <div
      className="contents"
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      {hasOpened ? renderEditor(trigger) : trigger}
    </div>
  );
}
