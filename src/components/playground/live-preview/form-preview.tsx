import { useState } from "react";
import { Paintbrush, PaintBucket, Trash2 } from "lucide-react";

import { usePlaygroundStore } from "@/stores/playground";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormDemo } from "./form-demo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { z } from "zod";
import { BackgroundColorDialog } from "../background-color-dialog";
import { EditHeadingDialog } from "../edit-heading-dialog";
import { EditSubmitButtonDialog } from "../edit-submit-button-dialog";

export function FormPreview({
  className,
  formSchema,
  defaultValues,
}: {
  className?: string;
  formSchema: z.ZodObject<
    Record<string, z.ZodTypeAny>,
    "strip",
    z.ZodTypeAny,
    {
      [x: string]: unknown;
    },
    {
      [x: string]: unknown;
    }
  >;
  defaultValues: Record<string, unknown>;
}) {
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  const {
    form,
    nextFieldId,
    setShowBackground,
    backgroundDialogOpen,
    setBackgroundDialogOpen,
    editHeadingDialogOpen,
    setEditHeadingDialogOpen,
    editSubmitButtonDialogOpen,
    setEditSubmitButtonDialogOpen,
  } = usePlaygroundStore();

  if (form.fields.length === 0) {
    return (
      <Card className={cn("flex min-h-96 flex-1 items-center justify-center px-4 text-center", className)}>
        <p className="max-w-72 text-sm text-zinc-500">
          Start adding fields to the form to get started and then visualize the form preview.
        </p>
      </Card>
    );
  }

  return (
    <Card className={cn("relative min-h-96 overflow-hidden py-0", className)}>
      <FormDemo
        key={nextFieldId}
        formSchema={formSchema}
        defaultValues={defaultValues}
        formValues={formValues}
        setFormValues={setFormValues}
      />

      {form.metadata.showBackground && (
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Button className="absolute top-5 right-4" variant="outline" size="icon">
                    <PaintBucket className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <TooltipContent side="left">
                <p>Customize background</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent align="end" className="w-56">
            {form.metadata.showBackground ? (
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setBackgroundDialogOpen(true)}>
                  <Paintbrush />
                  Change color
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowBackground(false)} className="group">
                  <Trash2 className="text-zinc-500 transition-colors group-hover:text-red-600" />
                  Remove background
                </DropdownMenuItem>
              </DropdownMenuGroup>
            ) : (
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setShowBackground(true)} className="group">
                  <Paintbrush />
                  Add background
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <BackgroundColorDialog open={backgroundDialogOpen} onOpenChange={setBackgroundDialogOpen} />
      <EditHeadingDialog open={editHeadingDialogOpen} onOpenChange={setEditHeadingDialogOpen} />
      <EditSubmitButtonDialog open={editSubmitButtonDialogOpen} onOpenChange={setEditSubmitButtonDialogOpen} />
    </Card>
  );
}
