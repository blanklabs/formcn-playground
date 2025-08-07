"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Link from "next/link";
import { Play, ArrowUp, PartyPopper, LucideIcon, Phone, ChartBar, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";
import { usePlaygroundStore } from "@/stores/playground";
import { Form as FormSpecType } from "@/core/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  prompt: z.string().min(1),
});

export function PromptBar() {
  const { setForm } = usePlaygroundStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });
  const prompt = form.watch("prompt");
  const isSubmitting = form.formState.isSubmitting;

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        toast.error(errorData.error || "It was not possible to generate the form. Please try again later.");
      } catch {
        toast.error("It was not possible to generate the form. Please try again later.");
      }
    } else {
      const data = await response.json();
      console.log(data);
      setForm(data as FormSpecType);
      router.push("/playground");
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative h-32 w-full rounded-2xl bg-white p-4 pt-3.5 pb-0"
        >
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    disabled={isSubmitting}
                    placeholder="What do you want to build?"
                    rows={3}
                    className="h-full w-full resize-none rounded-lg p-2 pb-3.5 outline-0 placeholder:text-zinc-500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={prompt.trim().length === 0 || isSubmitting}
            className="absolute right-4 bottom-4 flex size-7 items-center justify-center transition-colors disabled:bg-zinc-200 disabled:opacity-100"
            size="icon"
          >
            {isSubmitting ? <Spinner className="size-4" /> : <ArrowUp />}
          </Button>
        </form>
      </Form>
      <div className="mt-3 flex flex-col items-center justify-center space-y-3">
        <div className="flex gap-2">
          <TemplateButton
            text="Birthday party"
            disabled={prompt.length !== 0 || isSubmitting}
            icon={PartyPopper}
            iconClassName="text-red-500 group-hover:text-red-600"
            templateKey="birthday"
          />
          <TemplateButton
            text="Market research"
            disabled={prompt.length !== 0 || isSubmitting}
            icon={ChartBar}
            iconClassName="text-blue-500 group-hover:text-blue-600"
            templateKey="marketResearch"
          />
          <TemplateButton
            text="Contact"
            disabled={prompt.length !== 0 || isSubmitting}
            icon={Phone}
            iconClassName="text-green-500 group-hover:text-green-600"
            templateKey="contact"
          />
          <TemplateButton
            text="Event feedback"
            disabled={prompt.length !== 0 || isSubmitting}
            icon={MessageCircle}
            iconClassName="text-yellow-500 group-hover:text-yellow-600"
            templateKey="eventFeedback"
          />
          <TemplateButton
            text="Workshop registration"
            disabled={prompt.length !== 0 || isSubmitting}
            icon={Calendar}
            iconClassName="text-purple-500 group-hover:text-purple-600"
            templateKey="workshopRegistration"
          />
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <Button
            asChild
            variant="default"
            disabled={prompt.length !== 0 || isSubmitting}
            className="flex items-center gap-2 transition-all [&_svg:not([class*='size-'])]:size-3"
          >
            <Link className={cn(prompt.length !== 0 && "pointer-events-none opacity-50")} href="/playground">
              Or, get started without AI
              <Play size={8} className="fill-white" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}

function TemplateButton({
  text,
  disabled,
  icon: Icon,
  iconClassName,
  templateKey,
}: {
  text: string;
  disabled: boolean;
  icon: LucideIcon;
  iconClassName: string;
  templateKey: string;
}) {
  return (
    <Button
      asChild
      variant="outline"
      disabled={disabled}
      className="group flex w-auto items-center gap-2 transition-all [&_svg:not([class*='size-'])]:size-3"
    >
      <Link className={cn(disabled && "pointer-events-none opacity-50")} href={`/playground?template=${templateKey}`}>
        <Icon size={8} className={cn(iconClassName)} />
        {text}
      </Link>
    </Button>
  );
}
