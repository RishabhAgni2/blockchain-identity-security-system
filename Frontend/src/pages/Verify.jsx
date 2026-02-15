import { useState } from "react";
import API from "../services/api";
import "../auth.css";

export default function Verify() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      setLoading(true);

      const res = await API.post("/verify", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data);

    } catch (err) {
      alert("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ width: "450px" }}>
        <h2>Verify Document</h2>

        <form onSubmit={handleVerify}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit" style={{ marginTop: "15px" }}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {result && (
          <div style={{ marginTop: "20px" }}>
            {result.verified ? (
              <div style={{ color: "green" }}>
                ✅ Document Verified
              </div>
            ) : (
              <div style={{ color: "red" }}>
                ❌ Document Tampered or Not Found
              </div>
            )}

            {result.hash && (
              <p style={{ marginTop: "10px" }}>
                Hash: {result.hash.substring(0, 15)}...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}