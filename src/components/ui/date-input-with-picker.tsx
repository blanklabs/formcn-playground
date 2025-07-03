"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  formatDateFromValue,
  formatDateForValue,
  formatDateInput,
  createDateFromValue,
  formatDateToValue,
} from "@/helpers/date-helpers";

interface DateInputWithPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * DateInputWithPicker Component
 *
 * A reusable component that combines manual date input with calendar picker.
 * Features:
 * - Manual input with MM/DD/YYYY formatting and auto-correction
 * - Calendar picker with dropdown month/year selection
 * - Timezone-safe date handling
 * - Real-time validation and formatting
 *
 * @param value - Current date value in YYYY-MM-DD format
 * @param onChange - Callback when date changes, receives YYYY-MM-DD format
 * @param placeholder - Placeholder text for the input field
 * @param className - Additional CSS classes for the container
 * @param disabled - Whether the input is disabled
 */
export function DateInputWithPicker({
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  className,
  disabled = false,
}: DateInputWithPickerProps) {
  const [displayValue, setDisplayValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  // Update display value when value changes
  React.useEffect(() => {
    setDisplayValue(formatDateFromValue(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value);
    setDisplayValue(formatted);

    // Convert to form value if we have a complete date
    const formattedValue = formatDateForValue(formatted);
    onChange(formattedValue);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Create date string in local timezone to avoid D-1 bug
      const formattedValue = formatDateToValue(date);
      onChange(formattedValue);
    }
    setIsOpen(false);
  };

  // Parse the current value for calendar selection (avoiding timezone issues)
  const selectedDate = React.useMemo(() => {
    return createDateFromValue(value);
  }, [value]);

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleInputChange}
        maxLength={10}
        disabled={disabled}
        className="pr-10"
      />
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
            type="button"
            disabled={disabled}
          >
            <CalendarIcon className="text-muted-foreground h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
          <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} captionLayout="dropdown" />
        </PopoverContent>
      </Popover>
    </div>
  );
}
