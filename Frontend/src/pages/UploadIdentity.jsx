import React, { useState } from "react";

function UploadIdentity() {
  const [file, setFile] = useState(null);
  const [hash, setHash] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setHash("");
  };

  const generateFakeHash = () => {
    if (!file) {
      alert("Please upload a file first");
      return;
    }
    // Fake hash for frontend MVP
    const fakeHash =
      Math.random().toString(36).substring(2) +
      Math.random().toString(36).substring(2);
    setHash(fakeHash);
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Upload Identity Document</h2>

      <input type="file" onChange={handleFileChange} />

      <br /><br />

      <button onClick={generateFakeHash}>
        Generate Document Hash
      </button>

      {hash && (
        <div style={{ marginTop: "20px" }}>
          <strong>Generated Hash:</strong>
          <p style={{ wordBreak: "break-all" }}>{hash}</p>
        </div>
      )}
    </div>
  );
}

export default UploadIdentity;
