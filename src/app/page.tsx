"use client";

import { Suspense, useEffect, useState } from "react";
import { LivePreview } from "@/components/playground/live-preview";
import { PreviewTabs } from "@/components/playground/live-preview/preview-tabs";
import { FormFields } from "@/components/playground/form-fields";
import { PayloadPreview } from "@/components/playground/live-preview/payload-preview";
import { Toolbar } from "@/components/playground/toolbar";
import { Input } from "@/components/ui/input";
import { usePlaygroundStore } from "@/stores/playground";
import { useAutoSave } from "@/hooks/use-auto-save";
import { cn } from "@/lib/utils";

function InlineEditableTitle() {
  const { form, setForm } = usePlaygroundStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(form.name);

  useEffect(() => {
    setTitle(form.name);
  }, [form.name]);

  const handleSave = () => {
    if (title.trim() !== form.name) {
      setForm({
        ...form,
        name: title.trim() || "Untitled Form",
      });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setTitle(form.name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-auto max-w-lg border-none bg-transparent p-0 text-3xl font-bold tracking-tight shadow-none focus-visible:ring-0"
        style={{ fontSize: "1.875rem", lineHeight: "2.25rem" }}
        autoFocus
      />
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className={cn(
        "-mx-2 -my-1 rounded px-2 py-1 text-left text-3xl font-bold tracking-tight transition-colors hover:bg-zinc-50",
        "focus:ring-2 focus:ring-zinc-300 focus:outline-none",
      )}
    >
      {form.name || "Untitled Form"}
    </button>
  );
}

export default function Home() {
  const { isLoading, error } = usePlaygroundStore();
  const { isSaving, hasUnsavedChanges } = useAutoSave();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div>Loading form...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <main className="flex flex-col gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-4 pb-4">
          <InlineEditableTitle />
          <div className="flex items-center gap-2">
            {isSaving && <div className="text-sm text-zinc-500">Saving...</div>}
            {hasUnsavedChanges && !isSaving && <div className="text-sm text-zinc-500">Unsaved changes</div>}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <div className="mb-3 flex h-9 items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Form fields</h2>
            </div>
            <Toolbar />
            <Suspense fallback={<div>Loading form fields...</div>}>
              <FormFields />
            </Suspense>
          </div>
          <div className="w-full space-y-5 sm:w-1/2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Preview</h2>
              <PreviewTabs />
            </div>
            <LivePreview />
            <PayloadPreview />
          </div>
        </div>
      </main>
    </>
  );
}
