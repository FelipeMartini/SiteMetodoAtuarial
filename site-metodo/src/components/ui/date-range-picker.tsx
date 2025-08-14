'use client';

import * as React from 'react';

import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Calendar } from '@/components/ui/calendar';
import type { DateRange } from 'react-day-picker';

export type { DateRange };

interface DayComponentProps {
  day: unknown;
  modifiers: Record<string, boolean>;
  className?: string;
}

interface DatePickerWithRangeProps {
  className?: string;
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
}



  export function DatePickerWithRange(props: DatePickerWithRangeProps) {
    const { className, date, onDateChange } = props;
    const [range, setRange] = React.useState<DateRange | undefined>(date);

    React.useEffect(() => {
      if (onDateChange) onDateChange(range);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [range]);

    const clearDates = () => {
      setRange(undefined);
    };


    // Lista de feriados nacionais (exemplo, pode ser expandida)
    const feriados = [
      // Formato: MM-DD
      '01-01', // Ano Novo
      '04-21', // Tiradentes
      '05-01', // Dia do Trabalho
      '09-07', // Independência
      '10-12', // N. Sra. Aparecida
      '11-02', // Finados
      '11-15', // Proclamação da República
      '12-25', // Natal
    ];

    function isFeriado(date: Date) {
      const mmdd = date.toISOString().slice(5, 10);
      return feriados.includes(mmdd);
    }

    function formatDate(date?: Date) {
      return date ? date.toLocaleDateString('pt-BR') : '';
    }

    return (
      <div className={cn('grid gap-2', className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-full justify-start text-left font-normal',
                !range && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {range?.from ? (
                range.to ? (
                  <>
                    {formatDate(range.from)} - {formatDate(range.to)}
                  </>
                ) : (
                  formatDate(range.from)
                )
              ) : (
                <span>Selecione o período</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
              className="rounded-md border"
              classNames={{
                day: 'relative h-9 w-9 p-0 font-normal transition-all duration-200 ease-in-out hover:scale-110 hover:z-10 hover:shadow-lg',
              }}
              components={{
                Day: ({ day, modifiers, ...rest }: DayComponentProps) => {
                  // day é CalendarDay, acessar .date
                  return (
                    <div className="relative group">
                      <div
                        {...rest}
                        className={cn(
                          'relative h-9 w-9 flex items-center justify-center p-0 font-normal transition-all duration-200 ease-in-out',
                          modifiers.selected && 'bg-primary text-primary-foreground',
                          modifiers.range_start && 'rounded-l-md',
                          modifiers.range_end && 'rounded-r-md',
                          isFeriado((day as { date: Date }).date)
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 border-2 border-yellow-400 dark:border-yellow-600'
                            : '',
                          rest.className
                        )}
                        tabIndex={0}
                        role="button"
                        aria-label={formatDate((day as { date: Date }).date)}
                      >
                        {(day as { date: Date }).date.getDate()}
                        {isFeriado((day as { date: Date }).date) && (
                          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-yellow-400 dark:bg-yellow-500 animate-pulse" title="Feriado" />
                        )}
                      </div>
                      <span className="absolute left-1/2 -translate-x-1/2 top-10 z-20 hidden group-hover:block bg-background text-foreground text-xs rounded px-2 py-1 shadow-lg border border-border animate-fade-in">
                        {isFeriado((day as { date: Date }).date) ? 'Feriado Nacional' : ''}
                      </span>
                    </div>
                  );
                },
              }}
            />
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={clearDates}>
                Limpar
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
  );
}
