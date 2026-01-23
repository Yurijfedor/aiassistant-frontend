import { useState } from "react";
import { askHiveAI } from "./iaService";
import type { HiveData } from "./utils/schemas/hiveSchema";
// import type { HiveData } from "./utils/types/hive";
// import { isHiveData, isHiveDataValid } from "./utils/validators/hiveValidator";

function BeehiveCheck() {
  const [hiveNumber, setHiveNumber] = useState("");
  const [data, setData] = useState<HiveData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheck() {
    setLoading(true);
    const prompt = `Create JSON for a beehive check. Fields: hiveNumber (number), strength (1-5), queenStatus (present/absent/unknown), honey (kg). Use hiveNumber ${hiveNumber}.  Provide only JSON.`;
    try {
      const result = await askHiveAI(prompt);
      setData(result);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Invalid response from AI.");
    }
    setLoading(false);
  }

  return (
    <div>
      <h2>Beehive Check AI</h2>
      <input
        type="number"
        placeholder="Hive number"
        value={hiveNumber}
        onChange={(e) => setHiveNumber(e.target.value)}
      />
      <button onClick={handleCheck} disabled={loading}>
        Check Hive
      </button>

      {loading && <p>Thinking...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div>
          <p>Hive Number: {data.hiveNumber}</p>
          <p>Strength: {data.strength}</p>
          <p>Queen Status: {data.queenStatus}</p>
          <p>Honey: {data.honey} kg</p>
        </div>
      )}
    </div>
  );
}

export default BeehiveCheck;
