import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function VerifyQRPage() {
  const router = useRouter();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verifyQR = async (doc_id, version) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `${BASE_URL}/verify/qr?doc_id=${encodeURIComponent(doc_id)}&v=${version}`,
        { method: "GET" }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verifikasi gagal");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;

    const { doc_id, v } = router.query;

    if (!doc_id || !v) {
      setError("QR Code tidak valid (parameter tidak lengkap)");
      return;
    }

    verifyQR(doc_id, Number(v));
  }, [router.isReady, router.query]);

  const isValid = result?.valid === true;

  const formatToWIB = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString.replace(" ", "T"));

    return date.toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="qr-verify-container">
      <h2>Verifikasi Keaslian Data Kartu Keluarga</h2>

      {loading && (
        <div className="loading-wrapper">
          <div className="spinner"></div>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div className="qr-verify-result">
          <h3>Hasil Verifikasi</h3>

          <p>
            <b>Status Verifikasi:</b>{" "}
            <span style={{ color: isValid ? "green" : "red" }}>
              {isValid ? "VALID" : "TIDAK VALID"}
            </span>
          </p>

          <p><b>Digital Signature:</b> {result.digital_signature}</p>
          <p><b>Integritas Data:</b> {result.integritas_data}</p>
          <p><b>Status Dokumen:</b> {result.status}</p>
          <p><b>Diverifikasi Pada:</b> {formatToWIB(result.verified_at)}</p>


          {isValid && result.data_kk && (
            <>
              <h4>DATA KARTU KELUARGA</h4>
              <table className="kk-verify-table">
                <tbody>
                  <tr><td>Nomor KK</td><td>{result.data_kk.nomor_kk}</td></tr>
                  <tr><td>Kepala Keluarga</td><td>{result.data_kk.kepala_keluarga}</td></tr>
                  <tr><td>Alamat</td><td>{result.data_kk.alamat}</td></tr>
                  <tr><td>RT/RW</td><td>{result.data_kk.rt_rw}</td></tr>
                  <tr><td>Desa/Kelurahan</td><td>{result.data_kk.desa_kelurahan}</td></tr>
                  <tr><td>Kecamatan</td><td>{result.data_kk.kecamatan}</td></tr>
                  <tr><td>Kabupaten/Kota</td><td>{result.data_kk.kabupaten_kota}</td></tr>
                  <tr><td>Provinsi</td><td>{result.data_kk.provinsi}</td></tr>
                  <tr><td>Kode Pos</td><td>{result.data_kk.kode_pos}</td></tr>
                  <tr><td>Tanggal Terbit</td><td>{result.data_kk.tanggal_terbit}</td></tr>
                  <tr><td>Penandatangan</td><td>{result.signer_name}</td></tr>
                </tbody>
              </table>

              <h4>DATA ANGGOTA KELUARGA</h4>
              <div className="table-wrapper">
                <table className="anggota-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama</th>
                      <th>NIK</th>
                      <th>JK</th>
                      <th>Tempat Lahir</th>
                      <th>Tanggal Lahir</th>
                      <th>Agama</th>
                      <th>Pendidikan</th>
                      <th>Pekerjaan</th>
                      <th>Status Kawin</th>
                      <th>Status Keluarga</th>
                      <th>Kewarganegaraan</th>
                      <th>Ayah</th>
                      <th>Ibu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.data_kk.anggota_keluarga.map((a, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{a.nama}</td>
                        <td>{a.nik}</td>
                        <td>{a.jenis_kelamin}</td>
                        <td>{a.tempat_lahir}</td>
                        <td>{a.tanggal_lahir}</td>
                        <td>{a.agama}</td>
                        <td>{a.pendidikan}</td>
                        <td>{a.pekerjaan}</td>
                        <td>{a.status_perkawinan}</td>
                        <td>{a.status_dalam_keluarga}</td>
                        <td>{a.kewarganegaraan}</td>
                        <td>{a.ayah}</td>
                        <td>{a.ibu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
