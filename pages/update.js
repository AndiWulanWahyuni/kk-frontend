import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import UpdateForm from "../components/UpdateForm";

export default function UpdatePage() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="update-page">
          <h2>Perbarui Data Kartu Keluarga</h2>
        </div>
        <UpdateForm />
      </div>
    </div>
  );
}
