"use client";

import * as React from "react";

import { DatePicker } from "@/components/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PeriodSelector } from "@/components/ui/period-selector";

interface DateTimePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  timeFormat?: "12h" | "24h";
  className?: string;
}

export function DateTimePicker({
  label,
  placeholder = "Select date and time",
  value,
  onValueChange,
  timeFormat = "24h",
  className,
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [time, setTime] = React.useState<string>("");
  const [period, setPeriod] = React.useState<"AM" | "PM">("AM");

  // Sync internal state when value or format changes
  React.useEffect(() => {
    setDate(value);
    if (value) {
      const hours24 = value.getHours();
      const mins = value.getMinutes();
      if (timeFormat === "12h") {
        const isPM = hours24 >= 12;
        const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
        setPeriod(isPM ? "PM" : "AM");
        setTime(`${String(hours12).padStart(2, "0")}:${String(mins).padStart(2, "0")}`);
      } else {
        setTime(`${String(hours24).padStart(2, "0")}:${String(mins).padStart(2, "0")}`);
      }
    }
  }, [value, timeFormat]);

  const formatTimeInput = (input: string) => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, "");

    // Limit to 4 digits
    const limitedDigits = digits.slice(0, 4);

    if (limitedDigits.length <= 2) {
      return limitedDigits;
    } else {
      // Insert colon after 2 digits
      const formatted = `${limitedDigits.slice(0, 2)}:${limitedDigits.slice(2)}`;

      // Validate hours based on time format
      if (formatted.length >= 2) {
        const hours = parseInt(formatted.slice(0, 2), 10);
        if (timeFormat === "12h") {
          // For 12h format, hours should be 01-12
          if (hours < 1 || hours > 12) {
            // Return only the valid part or empty
            return limitedDigits.slice(0, 1);
          }
        } else {
          // For 24h format, hours should be 00-23
          if (hours > 23) {
            return limitedDigits.slice(0, 1);
          }
        }
      }

      return formatted;
    }
  };

  const updateDateTime = (newDate?: Date, newTime?: string, newPeriod?: "AM" | "PM") => {
    const currentDate = newDate || date;
    const currentTime = newTime || time;
    const currentPeriod = newPeriod || period;

    if (currentDate && currentTime && /^\d{2}:\d{2}$/.test(currentTime)) {
      const [h, m] = currentTime.split(":").map(Number);

      // Validate minutes
      if (m >= 0 && m <= 59) {
        let hours24 = h;
        if (timeFormat === "12h") {
          if (currentPeriod === "PM" && h < 12) hours24 = h + 12;
          else if (currentPeriod === "AM" && h === 12) hours24 = 0;
        } else {
          // For 24h format, validate hours
          if (h > 23) return;
        }

        const newDateTime = new Date(currentDate);
        newDateTime.setHours(hours24, m, 0);
        setDate(newDateTime);
        onValueChange?.(newDateTime);
      }
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    updateDateTime(selectedDate, time, period);
  };

  const handleTimeChange = (inputValue: string) => {
    const formatted = formatTimeInput(inputValue);
    setTime(formatted);
    updateDateTime(date, formatted, period);
  };

  const handlePeriodChange = (newPeriod: "AM" | "PM") => {
    setPeriod(newPeriod);
    updateDateTime(date, time, newPeriod);
  };

  const formatDateTime = (date: Date) => {
    const dateStr = date.toLocaleDateString();
    const timeStr = timeFormat === "12h" ? `${time} ${period}` : date.toTimeString().slice(0, 5);
    return `${dateStr} ${timeStr}`;
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <Label className="px-1">{label}</Label>}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Date selector */}
        <div className="flex flex-1 flex-col gap-2">
          <Label className="text-muted-foreground px-1 text-sm">Date</Label>
          <DatePicker mode="single" placeholder={placeholder} value={date} onValueChange={handleDateSelect} />
        </div>

        {/* Time selector with optional AM/PM */}
        <div className="flex w-full flex-col gap-2 lg:w-auto lg:min-w-fit">
          <Label className="text-muted-foreground px-1 text-sm">Time</Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={time}
              onChange={(e) => handleTimeChange(e.target.value)}
              placeholder={timeFormat === "12h" ? "12:00" : "00:00"}
              maxLength={5}
              className="bg-background flex-1 lg:w-32 lg:flex-initial"
            />
            {timeFormat === "12h" && <PeriodSelector value={period} onValueChange={handlePeriodChange} />}
          </div>
        </div>
      </div>

      {date && <p className="text-muted-foreground px-1 text-sm">Selected: {formatDateTime(date)}</p>}
    </div>
  );
}
