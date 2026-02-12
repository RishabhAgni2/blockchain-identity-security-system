import UploadForm from "../components/UploadForm";
import DocumentList from "../components/DocumentList";

export default function Dashboard() {
  return (
    <div>
      <h2>User Dashboard</h2>
      <UploadForm />
      <DocumentList />
    </div>
  );
}
