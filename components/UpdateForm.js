import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function UpdateForm() {
  const router = useRouter();
  const [nomor_kk, setNomorKK] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (router.query.nomor_kk) {
      setNomorKK(router.query.nomor_kk);
    }
  }, [router.query.nomor_kk]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Silakan pilih file PDF KK");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);
    setVersion(null);

    try {
      const res = await fetch(`${BASE_URL}/update/${nomor_kk}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Gagal update data");
      }

      const data = await res.json();

      const url = new URL(data.verify_url);
      const v = url.searchParams.get("v");

      setResult(data);
      setVersion(Number(v));
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const downloadQR = async () => {
    if (!nomor_kk || version === null) {
      alert("Data QR belum siap");
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/qr?doc_id=${encodeURIComponent(nomor_kk)}&v=${version}`
      );

      if (!res.ok) {
        throw new Error("Gagal mengambil QR Code");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${nomor_kk}_v${version}.png`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="update-section">
      <h2 className="page-title">Update Data Kartu Keluarga</h2>

      <div className="form-group">
        <label>Nomor Kartu Keluarga:</label>
        <input type="text" value={nomor_kk} readOnly className="readonly-input" />
      </div>

      <div className="file-input-wrapper">
        <div className="file-name-display" onClick={handleBrowseClick}>
          {file ? file.name : "Pilih Dokumen PDF"}
        </div>
        <button type="button" onClick={handleBrowseClick} className="browse-button-up">
          Browse
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button type="submit" disabled={loading} className="update-button">
        {"Perbarui Data"}
      </button>
      {loading && (
        <div className="loading-wrapper">
          <div className="spinner"></div>
        </div>
      )}

      {result && (
        <div className="result-box">
          <h4>Hasil Pembaruan</h4>
          <p><b>Status:</b> Data Berhasil Diperbarui</p>
          <p><b>Nomor KK:</b> {result.doc_id}</p>
          <p><b>Tanggal Pembaruan:</b> {result.updated_at}</p>

          {version && (
            <div className="qr-section">
              {/* eslint-disable @next/next/no-img-element */}
              <img
                src={`${BASE_URL}/qr?doc_id=${nomor_kk}&v=${version}`}
                alt="QR Code"
                className="qr-image"
              />
              <button type="button" onClick={downloadQR} className="btn-download">
                Download QR Code
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
