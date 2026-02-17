import { useEffect } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin_logged_in");
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
      <div className="dashboard-content">
        <h1>Selamat Datang</h1>
        <div className="dashboard-cards">
          <div className="dashboard-card" onClick={() => router.push("/upload")}>
            <h3>Simpan Data Kartu Keluarga</h3>
          </div>
          <div className="dashboard-card" onClick={() => router.push("/list")}>
            <h3>List Data Kartu Keluarga</h3>
          </div>
          <div className="dashboard-card" onClick={() => router.push("/verify")}>
            <h3>Verifikasi Data Kartu Keluarga</h3>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
