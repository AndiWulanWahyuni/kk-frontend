import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul>
        <li onClick={() => router.push("/dashboard")}>Dashboard</li>
        <li onClick={() => router.push("/upload")}>Simpan Data</li>
        <li onClick={() => router.push("/list")}>List Data</li>
        <li onClick={() => router.push("/verify")}>Verifikasi Data</li>
      </ul>
    </div>
  );
}
