import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../dashboard.css";

export default function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const res = await API.get("/documents");
    setDocuments(res.data.documents);
  };

  const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append("document", file);
    await API.post("/documents/upload", formData);
    fetchDocuments();
  };

  const deleteDoc = async (id) => {
    await API.delete(`/documents/${id}`);
    fetchDocuments();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <h3>SecureDoc</h3>
        <button onClick={() => setActive("dashboard")}>Dashboard</button>
        <button onClick={() => setActive("upload")}>Upload Document</button>
        <button onClick={() => setActive("documents")}>My Documents</button>
        <button onClick={() => setActive("verify")}>Verify Document</button>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="main-content">

        {active === "dashboard" && (
          <h2>Total Documents: {documents.length}</h2>
        )}

        {active === "upload" && (
          <UploadSection onUpload={uploadDocument} />
        )}

        {active === "documents" && (
          <>
            {documents.map((doc) => (
              <div key={doc._id} className="doc-card">
                <h4>{doc.originalName}</h4>
                <p>Hash: {doc.fileHash.substring(0, 10)}...</p>
                <button onClick={() => deleteDoc(doc._id)}>Delete</button>
              </div>
            ))}
          </>
        )}

        {active === "verify" && (
          <VerifySection />
        )}

      </div>
    </div>
  );
}

function UploadSection({ onUpload }) {
  const [file, setFile] = useState(null);

  return (
    <>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={() => onUpload(file)}>Upload</button>
    </>
  );
}

function VerifySection() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const verify = async () => {
    const formData = new FormData();
    formData.append("document", file);

    const res = await API.post("/verify", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setResult(res.data.verified);
  };

  return (
    <>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={verify}>Verify</button>

      {result !== null && (
        <h3 style={{ color: result ? "green" : "red" }}>
          {result ? "Verified ✅" : "Tampered ❌"}
        </h3>
      )}
    </>
  );
}