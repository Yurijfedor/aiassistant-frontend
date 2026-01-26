import { HiveSchema } from "./utils/schemas/hiveSchema";
import type {
  StreamHandlers,
  StreamController,
} from "./utils/types/StreamHandler";

export function askAiStream(
  prompt: string,
  handlers: StreamHandlers,
): StreamController {
  const controller = new AbortController();

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_APP_OPENAI_API_KEY}`,
    },
    signal: controller.signal,
    body: JSON.stringify({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    }),
  })
    .then(async (res) => {
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        handlers.onChunk(decoder.decode(value));
      }

      handlers.onDone?.();
    })
    .catch((err) => {
      if (err.name !== "AbortError") {
        handlers.onError?.(err);
      }
    });

  return {
    cancel: () => controller.abort(),
  };
}

export async function askAIJSON(
  prompt: string,
): Promise<Record<string, unknown>> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that returns only JSON. No markdown. No explanations. ",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await response.json();
  // AI повертає текст → перетворюємо на JSON
  return JSON.parse(data.choices[0].message.content);
}

export async function askHiveAI(prompt: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Return ONLY valid JSON. No markdown. No explanations. Follow the provided schema exactly.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await response.json();
  const raw = JSON.parse(data.choices[0].message.content);

  return HiveSchema.parse(raw);
}
