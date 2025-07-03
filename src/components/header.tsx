import { MousePointerClick } from "lucide-react";
import { Tagline } from "./tagline";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e5e5e5] bg-[#e4e4e4]/95 px-4 py-5 backdrop-blur supports-[backdrop-filter]:bg-[#e4e4e4]/60 md:px-6 md:py-7">
      <div>
        <Link className="flex items-center gap-1.5" href="/">
          <MousePointerClick className="h-6 w-6 fill-amber-500" />
          <span className="text-xl leading-none font-bold tracking-tight select-none">formcn</span>
        </Link>
      </div>
      <Tagline />
    </header>
  );
}
