import API from "../services/api";

export default function UploadForm() {
  const upload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("document", file);

    await API.post("/documents/upload", formData);
    alert("Document uploaded & proof stored");
  };

  return <input type="file" onChange={upload} />;
}
