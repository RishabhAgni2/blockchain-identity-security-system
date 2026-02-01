import React from "react";
import UploadIdentity from "./pages/UploadIdentity";

function App() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🔐 Blockchain Identity Security System</h1>
      <p>Secure identity upload & verification (Local MVP)</p>

      <UploadIdentity />
    </div>
  );
}

export default App;
