"use client";

import { PreviewTabs } from "@/components/preview-tabs";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-4 px-4 py-4 sm:flex-row md:px-6">
      <div className="w-full sm:w-1/2">
        <div className="mb-3 flex h-9 items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Form fields</h2>
        </div>
        {/* <Toolbar /> */}
        {/* <FormFields /> */}
      </div>
      <div className="w-full space-y-5 sm:w-1/2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Preview</h2>
          <PreviewTabs />
        </div>
        {/* <LivePreview />
        <PayloadPreview /> */}
      </div>
    </main>
  );
}
