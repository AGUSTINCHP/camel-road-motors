import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Desplegable con buscador: elegís de la lista de opciones (marcas, modelos,
 * colores, etc. — ya sea una lista fija o sacada del stock cargado) o, si
 * escribís algo que no está, lo usás igual como valor nuevo. Así no hace
 * falta mantener un catálogo cerrado de marcas/modelos del mundo entero.
 */
export function ComboboxField({
  label,
  value,
  onChange,
  options,
  placeholder = "Elegí o escribí...",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const uniqueOptions = useMemo(() => Array.from(new Set(options)).sort(), [options]);
  const showCreate =
    query.trim().length > 0 &&
    !uniqueOptions.some((o) => o.toLowerCase() === query.trim().toLowerCase());

  function select(next: string) {
    onChange(next);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value || placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter>
            <CommandInput
              placeholder="Buscar o escribir nuevo..."
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {uniqueOptions.length === 0 && !showCreate ? (
                <CommandEmpty>Escribí para agregar el primero.</CommandEmpty>
              ) : null}
              <CommandGroup>
                {showCreate ? (
                  <CommandItem value={query} onSelect={() => select(query.trim())}>
                    Usar "{query.trim()}"
                  </CommandItem>
                ) : null}
                {uniqueOptions.map((option) => (
                  <CommandItem key={option} value={option} onSelect={() => select(option)}>
                    <Check
                      className={cn(
                        "h-4 w-4",
                        value === option ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* input oculto solo para que el form nativo valide "required" si hace falta */}
      {required ? (
        <input tabIndex={-1} value={value} required onChange={() => {}} className="sr-only" />
      ) : null}
    </div>
  );
}
