import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlaygroundStore } from "@/stores/playground";
import { Check, Copy } from "lucide-react";

export function PublishFormDialog({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { form, isPublished } = usePlaygroundStore();

  // For local-only app, just simulate a published URL
  const publishedUrl = isPublished
    ? `http://localhost:3000/form/${form.name.toLowerCase().replace(/\s+/g, "-")}`
    : null;

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate publishing delay
    setTimeout(() => {
      // For local-only, just set the published state
      // In a real app, this would make an API call
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  const copyToClipboard = async () => {
    if (!publishedUrl) return;

    try {
      await navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy error:", error);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setCopied(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl leading-none tracking-tight">
            {publishedUrl ? "Form Published!" : "Publish form"}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            {publishedUrl
              ? "Your form is now live! Share this link with anyone to collect responses."
              : "Publishing your form will generate a shareable link. Anyone with this link can submit responses to your form."}
          </DialogDescription>
        </DialogHeader>

        {publishedUrl && (
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">
              Shareable URL
            </Label>
            <div className="flex space-x-2">
              <Input id="url" value={publishedUrl} readOnly className="flex-1" />
              <Button className="px-3" onClick={copyToClipboard} variant="outline">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          {publishedUrl ? (
            <Button onClick={() => handleClose(false)} className="w-full">
              Done
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Publishing..." : "Publish"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
