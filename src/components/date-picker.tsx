"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface BaseDatePickerProps {
  label?: string;
  placeholder?: string;
  className?: string;
  numberOfMonths?: number;
}

interface SingleDatePickerProps extends BaseDatePickerProps {
  mode: "single";
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
}

interface RangeDatePickerProps extends BaseDatePickerProps {
  mode: "range";
  value?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  showPresets?: boolean;
}

type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

const dateRangePresets = [
  {
    label: "Today",
    range: {
      from: new Date(),
      to: new Date(),
    },
  },
  {
    label: "Last 7 days",
    range: {
      from: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
  },
  {
    label: "Last 30 days",
    range: {
      from: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
  },
  {
    label: "This month",
    range: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    },
  },
  {
    label: "Last month",
    range: {
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    },
  },
];

export function DatePicker(props: DatePickerProps) {
  const { label, placeholder, className, numberOfMonths = props.mode === "range" ? 2 : 1, mode } = props;

  // All hooks must be called at the top level, not conditionally
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(mode === "single" ? props.value : undefined);
  const [range, setRange] = React.useState<DateRange | undefined>(mode === "range" ? props.value : undefined);

  // Effects for single mode
  React.useEffect(() => {
    if (mode === "single") {
      setDate(props.value);
    }
  }, [mode, props.value]);

  // Effects for range mode
  React.useEffect(() => {
    if (mode === "range") {
      setRange(props.value);
    }
  }, [mode, props.value]);

  if (mode === "single") {
    const { onValueChange } = props;

    const handleSelect = (selectedDate: Date | undefined) => {
      setDate(selectedDate);
      onValueChange?.(selectedDate);
      setOpen(false);
    };

    const displayText = date ? date.toLocaleDateString() : placeholder || "Select date";

    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label && (
          <Label htmlFor="date" className="px-1">
            {label}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" id="date" className="w-full justify-between font-normal">
              {displayText}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar mode="single" selected={date} captionLayout="dropdown" onSelect={handleSelect} />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  // Range mode
  const { onValueChange, showPresets = false } = props;

  const handleRangeSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
    onValueChange?.(selectedRange);

    // Close popover when both dates are selected
    if (selectedRange?.from && selectedRange?.to) {
      setOpen(false);
    }
  };

  const handlePresetSelect = (preset: DateRange) => {
    setRange(preset);
    onValueChange?.(preset);
    setOpen(false);
  };

  const formatDateRange = (range: DateRange) => {
    if (!range?.from) return placeholder || "Select date range";

    if (range.to) {
      return `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`;
    }

    return `${range.from.toLocaleDateString()} - Select end date`;
  };

  const getDayCount = (range: DateRange) => {
    if (!range?.from || !range?.to) return null;

    const diffTime = Math.abs(range.to.getTime() - range.from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <Label className="px-1">{label}</Label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between font-normal">
            <span className="truncate">{range ? formatDateRange(range) : placeholder || "Select date range"}</span>
            <ChevronDownIcon className="h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <div className="flex">
            {showPresets && (
              <div className="bg-muted/50 w-48 border-r p-3">
                <h4 className="mb-3 font-medium">Quick Select</h4>
                <div className="space-y-1">
                  {dateRangePresets.map((preset) => (
                    <Button
                      key={preset.label}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => handlePresetSelect(preset.range)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Calendar
                mode="range"
                defaultMonth={range?.from}
                selected={range}
                onSelect={handleRangeSelect}
                numberOfMonths={numberOfMonths}
                captionLayout="dropdown"
                className="rounded-lg border-0 shadow-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between border-t p-3">
            <div className="text-muted-foreground text-sm">
              {range?.from && range?.to && (
                <span>
                  {getDayCount(range)} day{getDayCount(range) !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRange(undefined);
                  onValueChange?.(undefined);
                }}
              >
                Clear
              </Button>
              <Button size="sm" onClick={() => setOpen(false)} disabled={!range?.from}>
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {range?.from && range?.to && (
        <div className="text-muted-foreground space-y-1 px-1 text-sm">
          <p>From: {range.from.toLocaleDateString()}</p>
          <p>To: {range.to.toLocaleDateString()}</p>
          <p className="font-medium">
            Duration: {getDayCount(range)} day{getDayCount(range) !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
