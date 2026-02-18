import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("../components/Sidebar"), {
  ssr: false,
});

const Topbar = dynamic(() => import("../components/Topbar"), {
  ssr: false,
});

const ListKK = dynamic(() => import("../components/ListKK"), {
  ssr: false,
});

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
