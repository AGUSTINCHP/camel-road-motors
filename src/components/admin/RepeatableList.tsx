import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Lista reordenable genérica para el panel: cada ítem se edita con lo que
 * devuelva `renderItem`, y alrededor se dibujan los controles de agregar,
 * quitar y mover arriba/abajo (mismo patrón que el reordenado de fotos del
 * formulario de vehículos).
 */
export function RepeatableList<T>({
  items,
  onChange,
  renderItem,
  newItem,
  addLabel = "Agregar",
  minItems = 1,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
  newItem: () => T;
  addLabel?: string;
  minItems?: number;
}) {
  function updateAt(index: number, patch: Partial<T>) {
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveAt(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange(next);
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1 space-y-3">{renderItem(item, (patch) => updateAt(index, patch))}</div>
            <div className="flex shrink-0 flex-col gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={index === 0}
                onClick={() => moveAt(index, -1)}
                aria-label="Mover antes"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={index === items.length - 1}
                onClick={() => moveAt(index, 1)}
                aria-label="Mover después"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={items.length <= minItems}
                onClick={() => removeAt(index)}
                aria-label="Quitar"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => onChange([...items, newItem()])}>
        <Plus className="mr-1.5 h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
}
