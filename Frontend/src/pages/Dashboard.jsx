import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../dashboard.css";

export default function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({
    totalDocs: 0,
    verified: 0,
    tampered: 0,
    totalVerifications: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await API.get("/documents");
      setDocuments(res.data.documents);
    } catch (err) {
      console.error("Error fetching documents", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/documents/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  const uploadDocument = async (file) => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    await API.post("/documents/upload", formData);

    fetchDocuments();
    fetchStats();
  };

  const deleteDoc = async (id) => {
    await API.delete(`/documents/${id}`);
    fetchDocuments();
    fetchStats();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <h2>ChainVerify</h2>

        <button onClick={() => setActive("dashboard")}>Dashboard</button>
        <button onClick={() => setActive("upload")}>Upload Document</button>
        <button onClick={() => setActive("documents")}>My Documents</button>
        <button onClick={() => setActive("verify")}>Verify Document</button>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="main-content">
        {active === "dashboard" && (
          <div className="stats-grid">
            <div className="card">
              <h3>Total Documents</h3>
              <p className="big-number">{stats.totalDocs}</p>
            </div>

            <div
              className="card"
              style={{ background: "#e6f9ed", color: "#0f9d58" }}
            >
              <h3>Verified</h3>
              <p className="big-number">{stats.verified}</p>
            </div>

            <div
              className="card"
              style={{ background: "#ffeaea", color: "#d93025" }}
            >
              <h3>Tampered</h3>
              <p className="big-number">{stats.tampered}</p>
            </div>

            <div className="card">
              <h3>Total Checks</h3>
              <p className="big-number">{stats.totalVerifications}</p>
            </div>
          </div>
        )}

        {active === "upload" && (
          <UploadSection onUpload={uploadDocument} />
        )}

        {active === "documents" && (
          <>
            {documents.map((doc) => (
              <div key={doc._id} className="doc-card">
                <h4>{doc.originalName}</h4>
                <p>Hash: {doc.fileHash.substring(0, 15)}...</p>
                <button
                  className="delete-btn"
                  onClick={() => deleteDoc(doc._id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </>
        )}

        {active === "verify" && (
          <VerifySection onVerifySuccess={fetchStats} />
        )}
      </div>
    </div>
  );
}

function UploadSection({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);
      await onUpload(file);
      alert("Stored on Blockchain successfully ✅");
      setFile(null);
    } catch (err) {
      alert("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Upload Document</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="primary-btn"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Storing on Blockchain..." : "Upload"}
      </button>
    </div>
  );
}

function VerifySection({ onVerifySuccess }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (!file) {
      alert("Please select file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("document", file);

      const res = await API.post("/verify", formData);

      setResult(res.data.verified);

      if (onVerifySuccess) onVerifySuccess();
    } catch (err) {
      alert("Verification failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Verify Document</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="primary-btn"
        onClick={verify}
        disabled={loading}
      >
        {loading ? "Checking Blockchain..." : "Verify"}
      </button>

      {result !== null && (
        <h3
          style={{
            color: result ? "green" : "red",
            marginTop: "15px",
          }}
        >
          {result ? "Verified ✅" : "Tampered ❌"}
        </h3>
      )}
    </div>
  );
}