import { z } from "zod";
import { generateFormFromUserPrompt } from "@/services/chat";

const promptSchema = z.object({
  prompt: z.string().min(1),
});

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const { prompt: validatedPrompt } = promptSchema.parse({ prompt });
    const result = await generateFormFromUserPrompt(validatedPrompt);
    return Response.json(result) ?? null;
  } catch (error: any) {
    // Check if it's an OpenAI API key error
    if (error?.name === "AI_LoadAPIKeyError" || error?.message?.includes("OpenAI API key is missing")) {
      return Response.json(
        { error: "OpenAI API key is not configured. Please add your API key to continue." },
        { status: 500 },
      );
    }

    console.error(error);

    // For other errors, return a generic message
    return Response.json({ error: "Failed to generate form. Please try again later." }, { status: 500 });
  }
}
