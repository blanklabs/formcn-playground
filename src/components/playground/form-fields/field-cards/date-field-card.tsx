import { Fragment, useState } from "react";
import { Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { usePlaygroundStore } from "@/stores/playground";
import { WithIdAndKey, DateField } from "@/core/types";
import { useHtmlDynamicId } from "@/hooks/use-html-dynamic-id";
import { DateFieldSettings } from "../field-settings/date-field-settings";
import { FieldCardHeader } from "./field-card-header";
import { FieldCardRemoveButton } from "./field-card-remove-button";
import { DialogTooltipTrigger } from "@/components/dialog-tooltip-trigger";

export function DateFieldCard({ field }: { field: WithIdAndKey<DateField> }) {
  const [fieldSettingsDialogOpen, setFieldSettingsDialogOpen] = useState(false);
  const { setField, removeField } = usePlaygroundStore();
  const { getFormFieldId } = useHtmlDynamicId(field.id);

  return (
    <Fragment>
      <FieldCardHeader fieldType={field.type} fieldFormat={field.format} />
      <div className="flex justify-between gap-1.5">
        <div className="w-full space-y-2">
          <Label className="font-medium" htmlFor={getFormFieldId("label")}>
            Label
          </Label>
          <Input
            onChange={(e) => setField(field.id, { ...field, label: e.target.value })}
            value={field.label}
            id={getFormFieldId("label")}
            placeholder="Label..."
          />
        </div>
        <div className="flex gap-1.5 self-end">
          <Dialog open={fieldSettingsDialogOpen} onOpenChange={setFieldSettingsDialogOpen}>
            <DialogTooltipTrigger tooltip="Field settings">
              <Button variant="outline">
                <Settings className="text-zinc-800" />
              </Button>
            </DialogTooltipTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl leading-none tracking-tight">Date field</DialogTitle>
                <DialogDescription>
                  Make changes to your form field here. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <DateFieldSettings
                format={field.format}
                pastEnabled={field.pastEnabled}
                futureEnabled={field.futureEnabled}
                timeFormat={field.timeFormat}
                minDate={field.minDate}
                maxDate={field.maxDate}
                defaultValue={field.defaultValue}
                onSave={(values) => {
                  const updatedField = {
                    ...field,
                    format: values.format,
                    pastEnabled: values.pastEnabled,
                    futureEnabled: values.futureEnabled,
                    timeFormat: values.timeFormat,
                    minDate: values.minDate || undefined,
                    maxDate: values.maxDate || undefined,
                    defaultValue: values.defaultValue,
                  };
                  setField(field.id, updatedField);
                  setFieldSettingsDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
          <FieldCardRemoveButton onRemove={() => removeField(field.id)} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={field.required}
          onCheckedChange={(checked) => setField(field.id, { ...field, required: checked })}
          id={getFormFieldId("required")}
        />
        <Label htmlFor={getFormFieldId("required")}>Required</Label>
      </div>
    </Fragment>
  );
}
