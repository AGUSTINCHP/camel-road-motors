import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { WhatsAppModal } from "@/components/WhatsAppModal";

export function WhatsAppFab() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Consultar por WhatsApp"
        className="fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-camel text-accent-foreground shadow-xl transition hover:scale-105 hover:bg-ink"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
      <WhatsAppModal
        open={open}
        onClose={() => setOpen(false)}
        context={{
          title: "Hablemos por WhatsApp",
          subject: "Quería hacerles una consulta general.",
        }}
      />
    </>
  );
}
