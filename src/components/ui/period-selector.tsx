"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PeriodSelectorProps {
  value: "AM" | "PM";
  onValueChange: (period: "AM" | "PM") => void;
  className?: string;
}

export function PeriodSelector({ value, onValueChange, className }: PeriodSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-20 ${className}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="AM">AM</SelectItem>
        <SelectItem value="PM">PM</SelectItem>
      </SelectContent>
    </Select>
  );
}
