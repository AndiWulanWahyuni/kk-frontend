import VerifyForm from "../components/VerifyForm";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AdminVerify() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="verify-page">
          <h2>Verifikasi Keaslian Data Kartu Keluarga</h2>
        </div>
        <VerifyForm />
      </div>
    </div>
  );
}
