import { useEffect, useState } from "react";
import API from "../services/api";

export default function DocumentList() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    API.get("/documents").then((res) => setDocs(res.data.documents));
  }, []);

  return (
    <div>
      <h3>Your Documents</h3>
      {docs.map((doc) => (
        <div key={doc._id}>
          <p>{doc.originalName}</p>
          <small>{doc.fileHash}</small>
        </div>
      ))}
    </div>
  );
}
