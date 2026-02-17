import { useState, useRef } from "react";

const BASE_URL = "http://localhost:8000";

export default function AdminVerifyPDF() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Silakan pilih file PDF Kartu Keluarga!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/verify/pdf`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Verifikasi gagal");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const isValid = result?.valid === true;

  return (
    <form onSubmit={handleVerify} className="verify-container">
      <h2>Verifikasi Data Kartu Keluarga</h2>

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
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button type="submit" disabled={loading} className="verify-button">
        {"Verifikasi Dokumen"}
      </button>
      {loading && (
        <div className="loading-wrapper">
          <div className="spinner"></div>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div className="verify-result">
          <h3>Hasil Verifikasi</h3>

          <p>
            <b>Status Verifikasi:</b>{" "}
            <span style={{ color: isValid ? "green" : "red" }}>
              {isValid ? "VALID" : "TIDAK VALID"}
            </span>
          </p>

          <p><b>Nomor KK:</b> {result.nomor_kk}</p>
          <p><b>Status Dokumen:</b> {result.status}</p>
          <p><b>Integritas Data:</b> {result.integritas_data}</p>
          <p><b>Digital Signature:</b> {result.digital_signature}</p>
          <p><b>Penandatangan:</b> {result.signer_name}</p>
          <p><b>Diverifikasi Pada:</b> {result.verified_at}</p>
        </div>
      )}
    </form>
  );
}
