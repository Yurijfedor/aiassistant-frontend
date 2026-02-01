import type { StreamHandlers } from "./types";

export function parseOpenAIStreamResponse(
  response: ReadableStream<Uint8Array>,
  handlers: StreamHandlers,
) {
  const reader = response.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let cancelled = false;
  let doneCalled = false;

  const safeDone = () => {
    if (doneCalled) return;
    doneCalled = true;
    handlers.onDone?.();
  };

  const cancel = () => {
    cancelled = true;
    reader.cancel();
    safeDone();
  };

  const processChunk = (chunk: Uint8Array) => {
    if (cancelled) return;

    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      const dataLine = line.slice(6).trim();
      if (!dataLine) continue;

      try {
        const parsed = JSON.parse(dataLine);

        if (parsed.type === "response.output_text.delta") {
          if (typeof parsed.delta === "string") {
            handlers.onChunk(parsed.delta);
          }
        }

        if (parsed.type === "response.completed") {
          safeDone();
          // cancel();
          return;
        }
      } catch (e) {
        handlers.onError?.(e);
      }
    }
  };

  const readLoop = async () => {
    try {
      while (!cancelled) {
        const { done, value } = await reader.read();
        if (done) {
          // 🔥 КЛЮЧОВИЙ ФІКС
          safeDone();
          break;
        }
        if (value) processChunk(value);
      }
    } catch (e) {
      handlers.onError?.(e);
      safeDone();
    }
  };

  readLoop();

  return { cancel };
}
