"use client";
import { LivePreview } from "@/components/playground/live-preview";
import { PreviewTabs } from "@/components/playground/live-preview/preview-tabs";
import { FormFields } from "@/components/playground/form-fields";
import { PayloadPreview } from "@/components/playground/live-preview/payload-preview";
import { Toolbar } from "@/components/playground/toolbar";

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-4 px-4 py-4 md:px-6">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          <div className="w-full sm:w-1/2">
            <div className="mb-3 flex h-9 items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Form fields</h2>
            </div>
            <Toolbar />
            <FormFields />
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
