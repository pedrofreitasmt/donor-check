import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useDebounce } from '@/hooks/use-debounce';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface AsyncSelectProps {
  source: string;
  cascade?: string;
  value?: string;
  initialLabel?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AsyncSelect({ source, cascade, value, initialLabel, onChange, placeholder, disabled }: AsyncSelectProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<{ id: string; label: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Infinite scroll states
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Ref para o observer
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reseta a paginação e opções sempre que a busca mudar
  useEffect(() => {
    setPage(1);
    setOptions([]);
  }, [debouncedSearch, source, cascade]);

  const fetchOptions = useCallback(async (currentPage: number, isLoadMore = false) => {
    if (cascade !== undefined && !cascade) {
      setOptions([]);
      return;
    }

    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await axios.post('/lookup', {
        source,
        search: debouncedSearch || null,
        cascade: cascade || null,
        page: currentPage
      });

      const mappedOptions = response.data.options.map((item: any) => ({
        id: String(item.value || item.id || item.ulid || ''),
        label: String(item.label || item.name || item.description || item.code || item.value || item.id || '---'),
        original: item,
      }));

      setOptions(prev => isLoadMore ? [...prev, ...mappedOptions] : mappedOptions);
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Erro ao buscar dados do lookup", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [debouncedSearch, source, cascade]);

  // Carrega a primeira página quando o popover abre ou a busca muda
  useEffect(() => {
    if (!open) return;
    fetchOptions(page, page > 1);
  }, [debouncedSearch, source, cascade, open, page, fetchOptions]);

  // Observer para infinite scroll
  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasMore || isLoading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage(p => p + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.unobserve(target);
  }, [hasMore, isLoading, isLoadingMore]);

  // Limpa o valor se o cascade pai mudar
  useEffect(() => {
    if (cascade !== undefined) {
      onChange('');
      setSearchTerm('');
    }
  }, [cascade]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled || (cascade !== undefined && !cascade)}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">
            {value ? options.find((opt) => opt.id === value)?.label || initialLabel || 'Selecionado...' : placeholder ?? "Selecione..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false} className="max-h-72">
          <CommandInput
            placeholder="Buscar..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList className="overflow-y-auto max-h-[200px] overscroll-contain">
            {isLoading && page === 1 ? (
              <div className="p-4 flex items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Buscando dados...
              </div>
            ) : (
              <>
                {!isLoading && options.length === 0 && (
                  <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                )}
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.id}
                      onSelect={(currentValue: string) => {
                        onChange(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          value === option.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="truncate">{option.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>

                {/* Sentinel para o Infinite Scroll */}
                {hasMore && (
                  <div ref={observerTarget} className="py-2 flex items-center justify-center text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}