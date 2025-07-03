"use client";

import { usePlaygroundStore } from "@/stores/playground";

export function Debug() {
  const { form } = usePlaygroundStore();

  return (
    <div className="px-6 text-xs">
      <pre>{JSON.stringify(form, null, 2)}</pre>
    </div>
  );
}
