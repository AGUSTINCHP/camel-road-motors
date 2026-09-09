import { useState } from "react";
import { WhatsAppModal, type WhatsAppContext } from "@/components/WhatsAppModal";
import { cn } from "@/lib/utils";

export function WhatsAppButton({
  context,
  children = "Consultar por WhatsApp",
  className,
}: {
  context: WhatsAppContext;
  children?: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center gap-2 bg-ink px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition hover:bg-camel",
          className,
        )}
      >
        {children}
      </button>
      <WhatsAppModal open={open} onClose={() => setOpen(false)} context={context} />
    </>
  );
}
