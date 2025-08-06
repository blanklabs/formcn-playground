import { PromptBar } from "@/components/prompt-bar";

export default function Home() {
  return (
    <main className="flex flex-grow items-center justify-center pt-8 pb-32 md:pb-16">
      <div className="w-full">
        <h1 className="mx-auto mb-6 block max-w-lg text-center text-xl leading-tight font-semibold tracking-tight text-balance text-zinc-900 lg:hidden">
          Build beautiful forms with shadcn/ui, React Hook Form and Zod
        </h1>
        <div className="mx-auto flex w-full max-w-198 flex-col items-center px-4 md:px-6">
          <PromptBar />
        </div>
      </div>
    </main>
  );
}
