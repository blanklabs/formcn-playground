"use client";

import * as React from "react";
import { ClockIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PeriodSelector } from "@/components/ui/period-selector";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TimePickerProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (time: string) => void;
  timeFormat?: "12h" | "24h";
  showSeconds?: boolean;
  className?: string;
}

export function TimePicker({
  label,
  value,
  onValueChange,
  timeFormat = "24h",
  showSeconds = false,
  className,
}: TimePickerProps) {
  const [time24, setTime24] = React.useState<string>(value || "");
  const [displayTime, setDisplayTime] = React.useState<string>("");
  const [period, setPeriod] = React.useState<"AM" | "PM">("AM");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (value) {
      setTime24(value);
      if (timeFormat === "12h") {
        const [h, m] = value.split(":").map(Number);
        const isPM = h >= 12;
        const h12 = h % 12 === 0 ? 12 : h % 12;
        setPeriod(isPM ? "PM" : "AM");
        setDisplayTime(`${h12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
      } else {
        setDisplayTime(value);
      }
    } else {
      setTime24("");
      setDisplayTime("");
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

  const onInputChange = (inputValue: string, fromClockPicker: boolean = false) => {
    let formatted = inputValue;

    // If input comes from clock picker (24h format), handle conversion
    if (fromClockPicker && timeFormat === "12h" && /^\d{2}:\d{2}$/.test(inputValue)) {
      const [h24, m] = inputValue.split(":").map(Number);
      const isPM = h24 >= 12;
      const h12 = h24 % 12 === 0 ? 12 : h24 % 12;

      // Update period automatically
      setPeriod(isPM ? "PM" : "AM");
      formatted = `${h12.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    } else {
      // Regular input formatting
      formatted = formatTimeInput(inputValue);
    }

    setDisplayTime(formatted);

    // Validate and convert to 24h format
    if (/^\d{2}:\d{2}$/.test(formatted)) {
      const [h, m] = formatted.split(":").map(Number);

      // Validate minutes
      if (m >= 0 && m <= 59) {
        let h24 = h;
        if (timeFormat === "12h") {
          // For 12h format, adjust based on period
          if (period === "PM" && h < 12) h24 = h + 12;
          if (period === "AM" && h === 12) h24 = 0;

          // If this is from clock picker, use the detected period instead
          if (fromClockPicker && /^\d{2}:\d{2}$/.test(inputValue)) {
            const [originalH24] = inputValue.split(":").map(Number);
            h24 = originalH24;
          }
        } else {
          // For 24h format, validate hours
          if (h > 23) return;
        }

        const hh = h24.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");
        const sec = showSeconds ? ":00" : "";
        const newTime = `${hh}:${mm}${sec}`;
        setTime24(newTime);
        onValueChange?.(newTime);
      }
    }
  };

  const onPeriodChange = (newPeriod: "AM" | "PM") => {
    setPeriod(newPeriod);
    if (/^\d{2}:\d{2}$/.test(displayTime)) {
      const [h, m] = displayTime.split(":").map(Number);
      let h24 = h;
      if (newPeriod === "PM" && h < 12) h24 = h + 12;
      if (newPeriod === "AM" && h === 12) h24 = 0;
      const hh = h24.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      const sec = showSeconds ? ":00" : "";
      const newTime = `${hh}:${mm}${sec}`;
      setTime24(newTime);
      onValueChange?.(newTime);
    }
  };

  const genOptions = () => {
    const opts = [];
    for (let h = 0; h < 24; h++) {
      for (let min = 0; min < 60; min += 15) {
        // 15-minute intervals for better UX
        const hh = h.toString().padStart(2, "0");
        const mm = min.toString().padStart(2, "0");
        const val = `${hh}:${mm}`;
        let disp = val;
        if (timeFormat === "12h") {
          const isPM = h >= 12;
          const h12 = h % 12 === 0 ? 12 : h % 12;
          const periodLabel = isPM ? "PM" : "AM";
          disp = `${h12.toString().padStart(2, "0")}:${mm} ${periodLabel}`;
        }
        opts.push({ value: val, display: disp });
      }
    }
    return opts;
  };

  const options = genOptions();

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <Label className="px-1">{label}</Label>}
      <div className="flex gap-2">
        <Input
          type="text"
          value={displayTime}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={timeFormat === "12h" ? "12:00" : "00:00"}
          maxLength={5}
          className="bg-background flex-1"
        />
        {timeFormat === "12h" && <PeriodSelector value={period} onValueChange={onPeriodChange} />}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <ClockIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="end">
            <div className="grid max-h-60 grid-cols-4 gap-1 overflow-y-auto">
              {options.map((opt) => (
                <Button
                  key={opt.value}
                  variant={time24.startsWith(opt.value) ? "default" : "ghost"}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    onInputChange(opt.value, true);
                    setOpen(false);
                  }}
                >
                  {opt.display}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {time24 && (
        <p className="text-muted-foreground px-1 text-sm">
          Selected: {timeFormat === "12h" ? `${displayTime} ${period}` : time24}
        </p>
      )}
    </div>
  );
}
