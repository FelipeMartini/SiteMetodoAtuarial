'use client';

import * as React from 'react';

import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export interface DateRange {
  from?: Date;
  to?: Date;
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
