import { useRef, useState } from "react";

export default function UploadForm() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [nomorKK, setNomorKK] = useState("");
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Silakan pilih file PDF Kartu Keluarga!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Upload gagal");
      }

      const url = new URL(data.verify_url);
      const docId = url.searchParams.get("doc_id");
      const v = url.searchParams.get("v");

      setMessage(data.message);
      setNomorKK(String(docId));
      setVersion(Number(v));

    } catch (err) {
      console.error(err);
      setMessage(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const downloadQR = async () => {
    if (!nomorKK || version === null) {
      alert("Data QR belum siap");
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/qr?doc_id=${encodeURIComponent(nomorKK)}&v=${version}`
      );

      if (!res.ok) {
        throw new Error("Gagal mengambil QR Code");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${nomorKK}_v${version}.png`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };


  return (
    <form onSubmit={handleUpload} className="upload-container">
      <h2 className="page-title">Upload & Tanda Tangani Data Kartu Keluarga</h2>

      <div className="file-input-wrapper">
        <div className="file-name-display" onClick={handleBrowseClick}>
          {file ? file.name : "Pilih Dokumen PDF"}
        </div>

        <button type="button" onClick={handleBrowseClick} className="browse-button">
          Browse
        </button>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </div>

      <button type="submit" disabled={loading} className="upload-button">
        {"Upload & Tanda Tangani"}
      </button>
      {loading && (
        <div className="loading-wrapper">
          <div className="spinner"></div>
        </div>
      )}


      {message && (
        <div className="upload-result">
          <p className="upload-message">{message}</p>

          {nomorKK && (
            <p>
              <b>Nomor KK:</b> {nomorKK}
            </p>
          )}

          {version && (
            <div className="qr-section">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE_URL}/qr?doc_id=${nomorKK}&v=${version}`}
                alt="QR Code KK"
                className="qr-image"
              />

              <button
                type="button"
                onClick={downloadQR}
                className="qr-download"
              >
                Download QR Code
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
