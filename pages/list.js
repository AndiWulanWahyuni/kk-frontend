import Sidebar from "../components/Sidebar";
import ListKK from "../components/ListKK";
import Topbar from "../components/Topbar";

export default function ListPage() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="list-page">
          <h2>Daftar Data Kartu Keluarga</h2>
        </div>
        <ListKK />
      </div>
    </div>
  );
}
