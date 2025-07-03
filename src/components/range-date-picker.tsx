"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

interface RangeDatePickerProps {
  label?: string;
  className?: string;
  value?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
}

export function RangeDatePicker({ label, className, value, onValueChange }: RangeDatePickerProps) {
  // --- State -----------------------------------------------------------------
  const [range, setRange] = React.useState<DateRange | undefined>(value);
  const [draft, setDraft] = React.useState<DateRange | undefined>(value);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<"start" | "end" | null>(null);

  const isDesktop = useMediaQuery("(min-width: 640px)"); // Tailwind sm breakpoint
  // Determine how many months to show based on screen size
  const monthsToShow = isDesktop ? 2 : 1;

  // Sync external value --------------------------------------------------------
  React.useEffect(() => {
    setRange(value);
    setDraft(value);
  }, [value]);

  // --- Helpers ----------------------------------------------------------------
  const fmt = React.useCallback((d?: Date) => (d ? d.toLocaleDateString() : ""), []);

  const handleFieldClick = (field: "start" | "end") => {
    setDraft(range);
    setActive(field);
    setOpen(true);
  };

  const handleSelect = (r?: DateRange) => {
    setDraft(r);
    if (r?.from && !r.to) setActive("end");
    if (!r?.from) setActive("start");
  };

  const confirm = () => {
    setRange(draft);
    onValueChange?.(draft);
    setOpen(false);
    setActive(null);
  };

  const cancel = () => {
    setDraft(range);
    setOpen(false);
    setActive(null);
  };

  const clear = () => {
    setDraft(undefined);
    setActive(null);
  };

  const start = range?.from;
  const end = range?.to;

  // --- Render -----------------------------------------------------------------
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <Label className="px-1 text-sm font-medium">{label}</Label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex flex-col gap-2 md:flex-row">
            {(
              [
                {
                  id: "start" as const,
                  label: "From",
                  date: start,
                  placeholder: "Select start date",
                },
                {
                  id: "end" as const,
                  label: "To",
                  date: end,
                  placeholder: "Select end date",
                },
              ] as const
            ).map(({ id, label: lbl, date, placeholder }) => (
              <div key={id} className="w-full md:flex-1">
                <Label className="text-muted-foreground mb-1 block text-xs">{lbl}</Label>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-between font-normal",
                    active === id && "ring-primary ring-2 ring-offset-2",
                    !date && "text-muted-foreground",
                  )}
                  onClick={() => handleFieldClick(id)}
                >
                  {date ? fmt(date) : placeholder}
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-auto max-w-[95vw] overflow-hidden p-0" sideOffset={4}>
          <Calendar
            mode="range"
            numberOfMonths={monthsToShow}
            defaultMonth={draft?.from}
            selected={draft}
            onSelect={handleSelect}
            captionLayout="dropdown"
            className="rounded-lg border-0 shadow-none"
            classNames={{
              months: "flex gap-6 [&>*:nth-child(2)_.rdp-weekdays]:hidden",
              month: "space-y-4",
              month_caption: "flex justify-center pb-2",
              weekdays: "flex",
              weekday: "text-muted-foreground text-xs font-normal w-9 text-center pb-2",
              week: "flex w-full",
              day: cn(
                "h-9 w-9 text-center text-sm font-normal",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:bg-accent focus:text-accent-foreground",
              ),
              range_start:
                "bg-primary text-primary-foreground rounded-l-md font-semibold ring-2 ring-primary ring-offset-1",
              range_middle: "bg-black text-white rounded-none",
              range_end:
                "bg-primary text-primary-foreground rounded-r-md font-semibold ring-2 ring-primary ring-offset-1",
              outside: "text-muted-foreground opacity-30 cursor-default pointer-events-none",
              disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
              selected: "bg-primary text-primary-foreground",
            }}
          />

          <div className="border-t p-3">
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" onClick={clear}>
                  Clear
                </Button>
                <Button type="button" variant="outline" size="sm" className="w-full sm:w-auto" onClick={cancel}>
                  Cancel
                </Button>
              </div>
              <Button type="button" size="sm" onClick={confirm} disabled={!draft?.from || !draft?.to}>
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
