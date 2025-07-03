import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { useEffect, useMemo } from "react";
import { usePlaygroundStore } from "@/stores/playground";
import { Button } from "@/components/ui/button";
import { DemoField } from "./demo-fields";
import { cn, getTailwindColorHex, getTextColorBasedOnBackground } from "@/lib/utils";
import { LetterText, RectangleHorizontal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { tailwindColors } from "@/static/tailwind-colors";

type FormDemoProps = {
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
  formValues: Record<string, unknown>;
  setFormValues: (values: Record<string, unknown>) => void;
};

export const FormDemo: React.FC<FormDemoProps> = ({ formSchema, defaultValues, formValues, setFormValues }) => {
  const {
    form: formSpec,
    setPayloadPreview,
    setEditHeadingDialogOpen,
    setEditSubmitButtonDialogOpen,
  } = usePlaygroundStore();

  const submitButtonColor = useMemo(() => {
    return tailwindColors[formSpec.metadata.submitButtonColor][formSpec.metadata.submitButtonShade];
  }, [formSpec.metadata.submitButtonColor, formSpec.metadata.submitButtonShade]);

  // When we insert a new field, the key (which is the nextFieldId) passed to FormDemo is incremented.
  // This causes the form to be recreated with new values.
  // This is a problem because the form state is lost.
  // To fix this, we merge the default values with the form values.
  // Form values are the values that the user has entered in the form. They are stored in the formValues object.
  // They are kept in sync with the form state by the useEffect hook below.
  const mergedValues = { ...defaultValues, ...formValues };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mergedValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement submission preview
    const payload = JSON.stringify(values, null, 2);
    setPayloadPreview(payload);
  }

  // This useEffect hook is used to keep the form values in sync with the form state.
  // When the form values change, the form state is updated.
  useEffect(() => {
    const subscription = form.watch((values) => {
      setFormValues(values);
    });
    return () => subscription.unsubscribe();
  }, [form, setFormValues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {formSpec.metadata.showBackground && (
          <div
            className="h-40"
            style={{
              backgroundColor: getTailwindColorHex({
                color: formSpec.metadata.backgroundColor,
                shade: formSpec.metadata.backgroundShade,
              }),
            }}
          />
        )}
        <div className={cn("space-y-4 pb-6", formSpec.metadata.showBackground ? "mt-4" : "mt-5")}>
          <div className="flex items-center justify-between">
            <div className="pl-6">
              {formSpec.metadata.title !== "" && (
                <h1 className="mb-1 text-3xl font-bold tracking-tight">{formSpec.metadata.title}</h1>
              )}
              {formSpec.metadata.description !== "" && (
                <p className="text-base text-zinc-500">{formSpec.metadata.description}</p>
              )}
            </div>
            <div className="pr-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => setEditHeadingDialogOpen(true)} type="button" variant="outline" size="icon">
                      <LetterText className="text-zinc-800" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Customize heading</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="mb-4 space-y-6 px-6">
            {formSpec.fields.map((field) => (
              <DemoField key={field.id} field={field} formControl={form.control} form={form} />
            ))}
          </div>
          <div className="flex items-center justify-between gap-4 pr-4 pl-6">
            <div className="w-full">
              <Button
                className="transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: submitButtonColor,
                  color: getTextColorBasedOnBackground(submitButtonColor),
                  width: formSpec.metadata.buttonWidthFull ? "100%" : "auto",
                }}
                type="submit"
              >
                {formSpec.metadata.submitButtonLabel === "" ? "Submit" : formSpec.metadata.submitButtonLabel}
              </Button>
            </div>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setEditSubmitButtonDialogOpen(true)}
                      type="button"
                      variant="outline"
                      size="icon"
                    >
                      <RectangleHorizontal className="text-zinc-800" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Customize button</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
