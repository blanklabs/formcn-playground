import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DateFieldFormat, DateFieldFormatSchema } from "@/core/types";

import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DateInputWithPicker } from "@/components/ui/date-input-with-picker";

const formSchema = z
  .object({
    format: DateFieldFormatSchema,
    pastEnabled: z.boolean(),
    futureEnabled: z.boolean(),
    timeFormat: z.enum(["12h", "24h"]).optional(),
    minDate: z.string().optional(),
    maxDate: z.string().optional(),
    defaultValue: z
      .union([
        z.string(),
        z.object({
          start: z.string(),
          end: z.string(),
        }),
      ])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.minDate && data.maxDate) {
      const minDate = new Date(data.minDate);
      const maxDate = new Date(data.maxDate);
      if (minDate > maxDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Minimum date must be before or equal to maximum date",
          path: ["minDate"],
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum date must be after or equal to minimum date",
          path: ["maxDate"],
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

export function DateFieldSettings({
  format,
  pastEnabled,
  futureEnabled,
  timeFormat,
  minDate,
  maxDate,
  defaultValue,
  onSave,
}: {
  format: DateFieldFormat;
  pastEnabled: boolean;
  futureEnabled: boolean;
  timeFormat?: "12h" | "24h";
  minDate?: string;
  maxDate?: string;
  defaultValue?: string | { start: string; end: string };
  onSave: (values: FormValues) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      format: format,
      pastEnabled: pastEnabled,
      futureEnabled: futureEnabled,
      timeFormat: timeFormat,
      minDate: minDate || "",
      maxDate: maxDate || "",
      defaultValue: defaultValue,
    },
  });

  const currentFormat = form.watch("format");
  const watchedMinDate = form.watch("minDate");
  const watchedMaxDate = form.watch("maxDate");
  const showTimeFormat = currentFormat === "time" || currentFormat === "datetime";

  // Real-time validation for min/max dates
  React.useEffect(() => {
    if (watchedMinDate && watchedMaxDate) {
      const minDate = new Date(watchedMinDate);
      const maxDate = new Date(watchedMaxDate);

      if (!isNaN(minDate.getTime()) && !isNaN(maxDate.getTime())) {
        if (minDate > maxDate) {
          form.setError("minDate", {
            type: "custom",
            message: "Minimum date must be before or equal to maximum date",
          });
          form.setError("maxDate", {
            type: "custom",
            message: "Maximum date must be after or equal to minimum date",
          });
        } else {
          // Clear errors if dates are valid
          if (form.formState.errors.minDate?.type === "custom") {
            form.clearErrors("minDate");
          }
          if (form.formState.errors.maxDate?.type === "custom") {
            form.clearErrors("maxDate");
          }
        }
      }
    } else {
      // Clear errors if one of the dates is empty
      if (form.formState.errors.minDate?.type === "custom") {
        form.clearErrors("minDate");
      }
      if (form.formState.errors.maxDate?.type === "custom") {
        form.clearErrors("maxDate");
      }
    }
  }, [watchedMinDate, watchedMaxDate, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
        <FormField
          control={form.control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a date format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="time">Time</SelectItem>
                  <SelectItem value="datetime">Date and time</SelectItem>
                  <SelectItem value="range">Date range picker</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {showTimeFormat && (
          <FormField
            control={form.control}
            name="timeFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time format</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "24h"}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="pastEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg">
                <div className="space-y-1">
                  <FormLabel>Enable past dates</FormLabel>
                  <FormDescription>Allow users to select dates in the past.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="futureEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg">
                <div className="space-y-1">
                  <FormLabel>Enable future dates</FormLabel>
                  <FormDescription>Allow users to select dates in the future.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {(currentFormat === "date" || currentFormat === "datetime") && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="minDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum date (optional)</FormLabel>
                  <FormControl>
                    <DateInputWithPicker value={field.value || ""} onChange={field.onChange} placeholder="MM/DD/YYYY" />
                  </FormControl>
                  <FormDescription>The earliest date users can select.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum date (optional)</FormLabel>
                  <FormControl>
                    <DateInputWithPicker value={field.value || ""} onChange={field.onChange} placeholder="MM/DD/YYYY" />
                  </FormControl>
                  <FormDescription>The latest date users can select.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <DialogFooter>
          <Button disabled={!form.formState.isValid} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
