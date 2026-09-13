import { runAgent } from "@/lib/agent";
import { z } from "zod";

const requestSchema = z.object({ message: z.string().trim().min(1).max(8_000) });

export async function POST(request: Request) {
  try {
    const { message } = requestSchema.parse(await request.json());
    return Response.json({ reply: await runAgent(message) });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Invalid request";
    return Response.json({ error: detail }, { status: 400 });
  }
}
