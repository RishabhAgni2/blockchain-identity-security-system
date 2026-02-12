import { useState } from "react";
import API from "../services/api";

export default function Verify() {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);

  const verify = async () => {
    const res = await API.get(`/verify/${hash}`);
    setResult(res.data);
  };

  return (
    <div>
      <h2>Verify Document</h2>
      <input
        placeholder="Paste document hash"
        onChange={(e) => setHash(e.target.value)}
      />
      <button onClick={verify}>Verify</button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
