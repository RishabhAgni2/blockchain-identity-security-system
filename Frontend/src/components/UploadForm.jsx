import { useState } from "react";
import API from "../services/api";

export default function UploadForm() {
  const [file, setFile] = useState(null);

  const upload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      await API.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Document uploaded successfully");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div className="document-card">
      <h3>Upload New Document</h3>

      <form onSubmit={upload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div style={{ marginTop: "10px" }}>
          <button className="verify-btn" type="submit">
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}
