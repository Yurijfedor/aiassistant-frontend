import { useRef, useState } from "react";
import { askAiStream } from "./iaService";
import type { AIStatus } from "./utils/types/aiStatus";
// import { fakeStream } from "./utils/functions/fakeStream";
import type { StreamController } from "./utils/types/StreamHandler";

function AiAssistant() {
  const [question, setQuestion] = useState("");
  // const [answer, setAnswer] = useState("");
  // const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AIStatus>("idle");
  const [output, setOutput] = useState("");
  const [cancelled, setCancelled] = useState(false);
  const streamRef = useRef<StreamController | null>(null);

  async function handleAsk() {
    streamRef.current?.cancel();

    streamRef.current = askAiStream(question, {
      onChunk: (chunk) => setOutput((prev) => prev + chunk),
      onDone: () => setStatus("done"),
      onError: () => setStatus("error"),
    });

    setStatus("streaming");
    // try {
    //   setStatus("thinking");
    //   setOutput("");

    //   const result = await askAi(question);

    //   setStatus("streaming");

    //   await fakeStream(
    //     JSON.stringify(result, null, 2),
    //     (chunk) => setOutput((prev) => prev + chunk),
    //     { cancelled: () => cancelled },
    //   );

    //   setStatus("done");
    // } catch {
    //   setStatus("error");
    // }
  }

  function handleCancel() {
    streamRef.current?.cancel();
    setStatus("idle");
  }

  return (
    <div>
      <h2>AI Assistant</h2>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something ..."
      />
      <button onClick={handleAsk} disabled={status === "thinking"}>
        Ask AI
      </button>
      {status === "streaming" && (
        <button
          onClick={handleCancel}
          disabled={status !== "streaming" && !cancelled}
        >
          Cancel
        </button>
      )}
      {status === "thinking" && <p>🧠 AI is thinking...</p>}
      {status === "streaming" && <pre>{output}</pre>}
      {status === "done" && (
        <p>
          ✅ Done: <br />
          {output}
        </p>
      )}
      {status === "error" && <p style={{ color: "red" }}>❌ Error</p>}
    </div>
  );
}
export default AiAssistant;
