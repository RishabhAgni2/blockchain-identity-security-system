export default function DocumentList({ documents, onDelete }) {

    const copyHash = (hash) => {
        navigator.clipboard.writeText(hash);
        alert("Hash copied to clipboard");
    };

    if (!documents || documents.length === 0) {
        return <p>No documents uploaded yet.</p>;
    }

    return (
        <>
            {documents.map((doc) => {
                const shortHash = doc.fileHash
                    ? doc.fileHash.substring(0, 8) + "..."
                    : "N/A";


                return (
                    <div key={doc._id} className="document-card">
                        <div className="document-header">
                            <h3>{doc.originalName}</h3>

                            <span
                                className={`badge ${doc.status === "verified"
                                        ? "verified"
                                        : doc.status === "tampered"
                                            ? "tampered"
                                            : "pending"
                                    }`}
                            >
                                {doc.status}
                            </span>
                        </div>

                        <p>
                            Hash: {shortHash}
                            <button
                                style={{ marginLeft: "10px" }}
                                onClick={() => copyHash(doc.fileHash)}
                            >
                                Copy
                            </button>
                        </p>

                        <p>
                            Uploaded:{" "}
                            {new Date(doc.createdAt).toLocaleDateString()}
                        </p>

                        <div style={{ marginTop: "10px" }}>
                            <button className="verify-btn">
                                Verify
                            </button>

                            <button
                                style={{
                                    background: "#dc2626",
                                    color: "white",
                                }}
                                onClick={() => onDelete(doc._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
