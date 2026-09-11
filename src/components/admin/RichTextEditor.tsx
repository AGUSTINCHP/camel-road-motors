import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Italic, Link2, Link2Off, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    extensions: [
      // StarterKit ya trae su propia extensión de Link en Tiptap v3; la
      // desactivamos acá para no duplicarla y usar la nuestra, configurada.
      StarterKit.configure({ heading: false, link: false }),
      Link.configure({ openOnClick: false, autolink: false }),
    ],
    content: value,
    // Evita el warning de hidratación de Tiptap en SSR: el contenido se
    // pinta recién en el cliente, imperceptible en un panel de admin.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose-suzuki min-h-[6rem] px-3 py-2 text-sm outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return <div className="min-h-[8.5rem] border border-border bg-muted/30" />;
  }

  return (
    <div className="border border-border bg-card">
      <div className="flex items-center gap-1 border-b border-border p-1.5">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          label="Negrita"
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          label="Cursiva"
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          label="Lista"
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          label="Lista numerada"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("link")}
          onClick={() => {
            if (editor.isActive("link")) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            const url = window.prompt("URL del enlace (ej: https://... o /catalogo)");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          label="Enlace"
        >
          {editor.isActive("link") ? (
            <Link2Off className="h-3.5 w-3.5" />
          ) : (
            <Link2 className="h-3.5 w-3.5" />
          )}
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-7 w-7 items-center justify-center border border-transparent transition hover:border-border",
        active && "border-camel bg-camel text-accent-foreground hover:border-camel",
      )}
    >
      {children}
    </button>
  );
}
