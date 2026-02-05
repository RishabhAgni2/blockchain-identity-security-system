import { useState } from "react";
import { createIdentity, getIdentity } from "../services/identityService";

const UploadIdentity = () => {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    document: "",
  });

  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await createIdentity(form);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error");
    }
  };

  const handleFetch = async () => {
    try {
      const res = await getIdentity(address);
      setResult(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Upload Identity</h2>

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
      /><br />

      <input
        name="dob"
        placeholder="DOB (YYYY-MM-DD)"
        onChange={handleChange}
      /><br />

      <input
        name="document"
        placeholder="Document ID"
        onChange={handleChange}
      /><br />

      <button onClick={handleSubmit}>Submit Identity</button>

      <p>{message}</p>

      <hr />

      <h3>Fetch Identity</h3>
      <input
        placeholder="Wallet address"
        onChange={(e) => setAddress(e.target.value)}
      />
      <br />
      <button onClick={handleFetch}>Fetch</button>

      {result && (
        <pre style={{ background: "#f4f4f4", padding: "10px" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default UploadIdentity;
