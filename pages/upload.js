import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import UploadForm from "../components/UploadForm";

export default function UploadPage() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="upload-page">
          <h2>Simpan Data Kartu Keluarga</h2>
        </div>
        <UploadForm />
      </div>
    </div>
  );
}
