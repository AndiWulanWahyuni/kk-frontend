import { useRouter } from "next/router";
import Image from "next/image";

export default function Topbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_name");
    router.push("/login");
  };

  return (
    <div className="topbar">
      <button className="logout" onClick={handleLogout}>
        <Image src="/icon-logout.png" alt="Logout" width={20} height={20} />
        Keluar</button>
    </div>
  );
}
