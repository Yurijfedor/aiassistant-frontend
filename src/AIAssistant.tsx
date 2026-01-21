import { useState } from "react";
import { askAi } from "./iaService";

function AiAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    setLoading(true);
    const response = await askAi(question);
    setAnswer(response);
    setLoading(false);
  }

  return (
    <div>
      <h2>AI Assistant</h2>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something ..."
      />
      <button onClick={handleAsk} disabled={loading}>
        Ask AI
      </button>
      {loading && <p>Thinking...</p>}
      {answer && <p>{answer}</p>}
    </div>
  );
}
export default AiAssistant;
