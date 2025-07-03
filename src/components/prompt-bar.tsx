"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { customToast as toast } from "@/lib/custom-toast";
import { AuthDialog } from "./auth/auth-dialog";
import { useEffect, useState, useCallback } from "react";
import { client, HttpError } from "@/lib/client";
import { authClient } from "@/lib/auth-client";
import { useTypingAnimation } from "@/hooks/use-typing-animation";
import { PromptInput } from "@/components/prompt-bar/prompt-input";
import { SubmitButton } from "@/components/prompt-bar/submit-button";
import { encodePromptToBase64, decodePromptFromBase64, DEMO_PROMPTS } from "@/lib/prompt-utils";
import { Button } from "@/components/ui/button";

/**
 * Form validation schema for prompt input
 */
const formSchema = z.object({
  prompt: z.string().min(1, "Please enter a prompt"),
});

/**
 * PromptBar component that provides an animated text input for form generation prompts.
 * Features a typing demo animation that cycles through example prompts when inactive.
 * Handles user authentication and form generation via API calls.
 *
 * Key features:
 * - Animated typing demo that showcases example prompts
 * - Form validation and submission handling
 * - User authentication integration
 * - URL parameter support for pre-filled prompts
 * - Beautiful animated border effects
 *
 * @returns The rendered prompt bar component
 */
export function PromptBar() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [boringMode, setBoringMode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();

  // Form setup with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const isSubmitting = form.formState.isSubmitting;
  const promptValue = form.watch("prompt");
  const isPromptEmpty = promptValue.trim().length === 0;

  /**
   * Updates the form field with new text from the typing animation
   */
  const handleTextChange = useCallback(
    (text: string) => {
      form.setValue("prompt", text, { shouldDirty: false });
    },
    [form],
  );

  // Initialize typing animation
  const { state: animationState, controls: animationControls } = useTypingAnimation({
    prompts: DEMO_PROMPTS,
    onTextChange: handleTextChange,
  });

  /**
   * Handles stopping the typing animation when user focuses the input
   */
  const handleInputFocus = useCallback(() => {
    animationControls.stop();
  }, [animationControls]);

  /**
   * Handles scheduling animation resume when input becomes empty
   */
  useEffect(() => {
    animationControls.scheduleResume(isPromptEmpty);
  }, [isPromptEmpty, animationControls]);

  /**
   * Loads prompt from URL query parameter on component mount
   */
  useEffect(() => {
    const promptParam = searchParams.get("prompt");
    if (promptParam) {
      const decodedPrompt = decodePromptFromBase64(promptParam);
      if (decodedPrompt) {
        // Stop animation and set the decoded prompt
        animationControls.stop();
        form.setValue("prompt", decodedPrompt);

        // Clean up URL parameter
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("prompt");
        const newURL = `${window.location.pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""}`;
        window.history.replaceState({}, "", newURL);
      }
    }
  }, [searchParams, form, animationControls]);

  /**
   * Handles form submission by generating a form spec from the user's prompt.
   * Redirects to playground on success or shows auth dialog if not authenticated.
   *
   * @param values - Form values containing the prompt text
   */
  const handleSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      // Check if user is authenticated
      if (!session) {
        setAuthDialogOpen(true);
        return;
      }

      try {
        // Submit prompt to API for form generation
        const response = await client.api.chat.$post({
          json: { prompt: values.prompt },
        });
        const data = await response.json();

        if (data.success) {
          toast.success(data.message);
          router.push(`/playground/${data.id}`);
        } else {
          toast.error("Failed to create form. Please try again.");
        }
      } catch (error) {
        // Handle authentication errors
        if (error instanceof HttpError && error.response.status === 401) {
          setAuthDialogOpen(true);
        } else {
          toast.error("It was not possible to generate the form. Please try again later.");
        }
      }
    },
    [session, router],
  );

  /**
   * Handles form submission when Enter key is pressed
   */
  const handleKeySubmit = useCallback(() => {
    form.handleSubmit(handleSubmit)();
  }, [form, handleSubmit]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className={`prompt-bar relative h-32 w-full rounded-2xl p-[2px] ${boringMode ? "boring-mode" : ""}`}
        >
          <div className="relative h-full w-full rounded-[inherit] bg-gradient-to-br from-slate-50 to-slate-100 p-4 pt-3.5 pb-0">
            <PromptInput
              control={form.control}
              isSubmitting={isSubmitting}
              isDemoRunning={animationState.isRunning}
              onFocus={handleInputFocus}
              onSubmit={handleKeySubmit}
            />

            <Button
              type="button"
              size="sm"
              variant={boringMode ? "default" : "outline"}
              onClick={() => setBoringMode(!boringMode)}
              className="absolute bottom-4 left-4 text-xs"
              title={boringMode ? "Enable RGB effects" : "Disable RGB effects"}
            >
              boring mode
            </Button>

            <SubmitButton
              isSubmitting={isSubmitting}
              isDemoRunning={animationState.isRunning}
              isEmpty={isPromptEmpty}
            />
          </div>
        </form>
      </Form>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        callbackQueryParams={{ prompt: encodePromptToBase64(promptValue) }}
      />

      <style jsx>{`
        /* ——————————————————————————————————————————
        Base container with 3D levitation effect
      —————————————————————————————————————————— */
        .prompt-bar {
          position: relative;
          overflow: visible;
          border-radius: 1rem;
          transform: translateY(-6px);
          /* 3D elevation shadows - subtle levitation */
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.1),
            0 4px 16px rgba(0, 0, 0, 0.06),
            0 2px 8px rgba(0, 0, 0, 0.04);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        /* ——————————————————————————————————————————
        Multiple pseudo-elements for layered effects
      —————————————————————————————————————————— */
        .prompt-bar::before,
        .prompt-bar::after {
          content: "";
          position: absolute;
          border-radius: inherit;
          pointer-events: none;
        }

        /* ——————————————————————————————————————————
        1) RAINBOW BORDER (visible ring)
      —————————————————————————————————————————— */
        .prompt-bar::before {
          inset: 0;
          padding: 2px;
          background: repeating-linear-gradient(
            90deg,
            #ff0000 0%,
            #ff7e00 16%,
            #ffee00 33%,
            #32ff00 50%,
            #00c8ff 66%,
            #7f00ff 83%,
            #ff0000 100%
          );
          background-size: 800% 100%;
          animation: rainbow-scroll 25s linear infinite;
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          transition: opacity 0.3s ease;
          z-index: 1;
        }

        /* Boring mode - disable RGB effects */
        .prompt-bar.boring-mode::before {
          background: #e2e8f0;
          animation: none;
        }

        /* ——————————————————————————————————————————
        2) INTENSE GLOW (large blurred reflection)
      —————————————————————————————————————————— */
        .prompt-bar::after {
          inset: -8px;
          background: repeating-linear-gradient(
            90deg,
            #ff0000 0%,
            #ff7e00 16%,
            #ffee00 33%,
            #32ff00 50%,
            #00c8ff 66%,
            #7f00ff 83%,
            #ff0000 100%
          );
          background-size: 800% 100%;
          animation: rainbow-scroll 25s linear infinite;
          filter: blur(16px);
          opacity: 0.3;
          z-index: -2;
          transition:
            filter 0.3s ease,
            opacity 0.3s ease;
        }

        .prompt-bar.boring-mode::after {
          display: none;
        }

        /* ——————————————————————————————————————————
        3) GROUND REFLECTION (mirror effect below)
      —————————————————————————————————————————— */
        .prompt-bar {
          position: relative;
        }

        .prompt-bar:before {
          /* Override above to add reflection */
        }

        /* Create reflection using a separate element */
        .prompt-bar > form {
          position: relative;
          z-index: 2;
        }

        .prompt-bar > form::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          height: 50%;
          background: repeating-linear-gradient(
            90deg,
            #ff0000 0%,
            #ff7e00 16%,
            #ffee00 33%,
            #32ff00 50%,
            #00c8ff 66%,
            #7f00ff 83%,
            #ff0000 100%
          );
          background-size: 800% 100%;
          animation: rainbow-scroll 25s linear infinite;
          border-radius: 0 0 1rem 1rem;
          filter: blur(16px);
          opacity: 0.2;
          transform: scaleY(-0.5) translateY(8px);
          transform-origin: top;
          pointer-events: none;
          z-index: -1;
          mask: linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
          -webkit-mask: linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
        }

        .prompt-bar.boring-mode > form::after {
          display: none;
        }

        /* ——————————————————————————————————————————
        4) AMBIENT UNDERGLOW (wide spread light)
      —————————————————————————————————————————— */
        .prompt-bar > form::before {
          content: "";
          position: absolute;
          inset: -16px;
          background: repeating-linear-gradient(
            90deg,
            #ff0000 0%,
            #ff7e00 16%,
            #ffee00 33%,
            #32ff00 50%,
            #00c8ff 66%,
            #7f00ff 83%,
            #ff0000 100%
          );
          background-size: 800% 100%;
          animation: rainbow-scroll 25s linear infinite;
          border-radius: 2rem;
          filter: blur(24px);
          opacity: 0.1;
          z-index: -3;
          pointer-events: none;
        }

        .prompt-bar.boring-mode > form::before {
          display: none;
        }

        /* ——————————————————————————————————————————
        Focus state — enhanced 3D effect
      —————————————————————————————————————————— */
        .prompt-bar:focus-within {
          transform: translateY(-10px);
          box-shadow:
            0 16px 48px rgba(0, 0, 0, 0.15),
            0 8px 24px rgba(0, 0, 0, 0.1),
            0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .prompt-bar:focus-within::before {
          opacity: 0.8;
          transition: opacity 0.3s ease;
        }

        .prompt-bar:focus-within::after {
          filter: blur(28px);
          opacity: 0.6;
          transition:
            filter 0.3s ease,
            opacity 0.3s ease;
        }

        .prompt-bar:focus-within > form::before {
          filter: blur(36px);
          opacity: 0.25;
          transition:
            filter 0.3s ease,
            opacity 0.3s ease;
        }

        .prompt-bar:focus-within > form::after {
          opacity: 0.3;
          filter: blur(20px);
          transition:
            filter 0.3s ease,
            opacity 0.3s ease;
        }

        /* Boring mode focus states - disable RGB enhancements */
        .prompt-bar.boring-mode:focus-within::before {
          background: #cbd5e1;
          opacity: 1;
        }

        .prompt-bar.boring-mode:focus-within::after,
        .prompt-bar.boring-mode:focus-within > form::before,
        .prompt-bar.boring-mode:focus-within > form::after {
          display: none;
        }

        /* ——————————————————————————————————————————
        Keyframes — smooth rainbow animation
      —————————————————————————————————————————— */
        @keyframes rainbow-scroll {
          0% {
            background-position: 0% 0;
          }
          100% {
            background-position: -800% 0;
          }
        }

        /* ——————————————————————————————————————————
        Subtle floating animation
      —————————————————————————————————————————— */
        @keyframes float {
          0%,
          100% {
            transform: translateY(-6px);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        .prompt-bar {
          animation: float 4s ease-in-out infinite;
        }

        .prompt-bar:focus-within {
          animation: none; /* Stop floating on interaction */
        }
      `}</style>
    </>
  );
}
