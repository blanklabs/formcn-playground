"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PreviewTabs() {
  const [currentTab, setCurrentTab] = useState("form");
  // const { currentTab, setCurrentTab } = usePlaygroundStore();

  return (
    <Tabs defaultValue="form" value={currentTab} onValueChange={setCurrentTab as (value: string) => void}>
      <TabsList>
        <TabsTrigger value="form">Form</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
