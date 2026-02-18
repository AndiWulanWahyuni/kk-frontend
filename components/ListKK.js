import { useEffect, useState, useCallback } from "react";

const ListKK = () => {
  const [dataKK, setDataKK] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const pagesPerBlock = 5;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    const res = await fetch(`${BASE_URL}/data`);
    const result = await res.json();
    if (result.status === "success") {
      setDataKK(result.data);
    }
  } catch (err) {
    console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = dataKK.filter((item) =>
    item.doc_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const currentBlock = Math.floor((currentPage - 1) / pagesPerBlock);
  const startPage = currentBlock * pagesPerBlock + 1;
  const endPage = Math.min(startPage + pagesPerBlock - 1, totalPages);

  const downloadQR = async (doc_id, version) => {
    try {
      const res = await fetch(
        `${BASE_URL}/qr?doc_id=${doc_id}&v=${version}`
      );

      if (!res.ok) {
        throw new Error("Gagal mengambil QR Code");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${doc_id}_v${version}.png`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };


  return (
    <div className="list-container">
      <h2 className="page-title">Data Kartu Keluarga</h2>

      <div className="list-controls">
        <input
          type="text"
          placeholder="Cari Nomor KK"
          className="search-box"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button className="btn-refresh" onClick={fetchData}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading-wrapper">
          <div className="spinner"></div>
        </div>
      ) : (
        <table className="kk-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nomor KK</th>
              <th>Kepala Keluarga</th>
              <th>Tanggal Terbit</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={`${item.doc_id}_${item.version}`}>
                  <td>{startIndex + index + 1}</td>
                  <td>{item.doc_id}</td>
                  <td>{item.data_kk.kepala_keluarga || "-"}</td>
                  <td>{item.data_kk.tanggal_terbit || "-"}</td>
                  <td
                    className={
                      item.status === "Aktif"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {item.status}
                  </td>

                  <td className="aksi-cell">
                    {/* eslint-disable @next/next/no-img-element */}
                    <img
                      src={`${BASE_URL}/qr?doc_id=${item.doc_id}&v=${item.version}`}
                      alt="QR Code"
                      className="qr-image"
                    />

                    <button
                      className="btn-download"
                      onClick={() =>
                        downloadQR(item.doc_id, item.version)
                      }
                    >
                      Download
                    </button>

                    <button
                      className="btn-edit"
                      onClick={() =>
                        (window.location.href = `/update?nomor_kk=${item.doc_id}`)
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Tidak ada data.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>

        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((page) => (
          <button
            key={page}
            className={
              page === currentPage
                ? "page-number active"
                : "page-number"
            }
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListKK;
