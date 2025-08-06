import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Link from "next/link";
import { MousePointerClick } from "lucide-react";
import { Tagline } from "@/components/tagline";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <SidebarInset>
        <div className="flex min-h-screen flex-col bg-[#e4e4e4]">
          <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e5e5e5] bg-[#e4e4e4]/95 px-4 py-5 backdrop-blur supports-[backdrop-filter]:bg-[#e4e4e4]/60 md:px-6 md:py-7">
            <div>
              <Link className="flex items-center gap-1.5" href="/">
                <MousePointerClick className="h-6 w-6 fill-amber-500" />
                <span className="text-xl leading-none font-bold tracking-tight select-none">formcn</span>
              </Link>
            </div>
            <Tagline />
            <SidebarTrigger className="-mr-1 ml-auto rotate-180" />
          </header>
          <div className="flex flex-1 flex-col gap-4">{children}</div>
        </div>
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
