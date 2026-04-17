/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  School, 
  TrendingUp, 
  Building2, 
  Baby, 
  User, 
  Users, 
  MapPin, 
  Calendar, 
  Contact, 
  Home, 
  CreditCard, 
  Mail, 
  Bus, 
  UserCircle, 
  Stethoscope, 
  Flag, 
  Ruler, 
  Navigation, 
  Save, 
  Printer, 
  CheckCircle, 
  CircleAlert,
  Search,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyqPWXrth0O7ieUqt0BH9igTjKWb8Gf8qBmlLomghbx-E1sbFfh5mVLF-vFhwJKP_0/exec";
const KUOTA_MAKSIMAL = 56;

interface FormData {
  nama: string;
  jk: string;
  nisn: string;
  tempat_lahir: string;
  tgl_lahir: string;
  nik: string;
  no_kk: string;
  no_akte: string;
  agama: string;
  pkh: string;
  alamat: string;
  kode_pos: string;
  anak_ke: string;
  tinggal: string;
  transportasi: string;
  hp: string;
  ayah_nama: string;
  ayah_nik: string;
  ayah_tahun: string;
  ayah_kerja: string;
  ayah_gaji: string;
  ibu_nama: string;
  ibu_nik: string;
  ibu_tahun: string;
  ibu_kerja: string;
  ibu_gaji: string;
  kelas: string;
  bb: string;
  tb: string;
  saudara: string;
  jarak: string;
  ket_usia: string;
}

export default function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [kuotaTerdaftar, setKuotaTerdaftar] = useState(0);
  const [usiaValue, setUsiaValue] = useState("0 Thn, 0 Bln, 0 Hr");
  const [usiaStatus, setUsiaStatus] = useState({ label: "Masukkan Tanggal", class: "bg-gray-500", valid: false });
  const [regNumber, setRegNumber] = useState("");
  const [formData, setFormData] = useState<FormData>({
    nama: "", jk: "Laki-laki", nisn: "", tempat_lahir: "", tgl_lahir: "",
    nik: "", no_kk: "", no_akte: "", agama: "Islam", pkh: "Tidak",
    alamat: "", kode_pos: "", anak_ke: "", tinggal: "Orang Tua", transportasi: "Jalan Kaki",
    hp: "", ayah_nama: "", ayah_nik: "", ayah_tahun: "", ayah_kerja: "",
    ayah_gaji: "", ibu_nama: "", ibu_nik: "", ibu_tahun: "", ibu_kerja: "",
    ibu_gaji: "", kelas: "", bb: "", tb: "", saudara: "", jarak: "",
    ket_usia: ""
  });

  useEffect(() => {
    fetchKuota();
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(fetchKuota, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchKuota = async () => {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=count&t=${new Date().getTime()}`);
      if (response.ok) {
        const data = await response.json();
        setKuotaTerdaftar(parseInt(data.jumlah) || 0);
      }
    } catch (e) {
      console.error("Gagal ambil kuota:", e);
    }
  };

  const calculateAge = (tgl: string) => {
    if (!tgl) return;
    const birthDate = new Date(tgl);
    const targetDate = new Date("2026-07-01");

    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const ageText = `${years} Thn, ${months} Bln, ${days} Hr`;
    setUsiaValue(ageText);
    
    let status = { label: "BELUM CUKUP USIA SD", class: "bg-red-500", valid: false };
    if (years >= 6) {
      status = { 
        label: years >= 7 ? "USIA PRIORITAS SD" : "MEMENUHI SYARAT SD", 
        class: years >= 7 ? "bg-green-600" : "bg-blue-600", 
        valid: true 
      };
      setFormData(prev => ({ ...prev, kelas: "Kelas 1", tgl_lahir: tgl, ket_usia: `${status.label} (${ageText})` }));
    } else {
      setFormData(prev => ({ ...prev, kelas: "", tgl_lahir: tgl, ket_usia: `BELUM CUKUP USIA (${ageText})` }));
    }
    setUsiaStatus(status);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, maxLength } = e.target;
    if (maxLength && value.length > maxLength) return;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.nama || formData.nik.length !== 16) {
      alert("⚠️ Nama Lengkap dan NIK (16 digit) wajib diisi!");
      return;
    }

    setIsSubmitting(true);
    const timestamp = new Date().toLocaleString('id-ID');
    const regNum = "SD-" + Math.floor(100000 + Math.random() * 900000);
    setRegNumber(regNum);

    const dataToSend = {
      ...formData,
      timestamp,
      sekolah_tujuan: "SDN MUARA BAKTI 01"
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(dataToSend),
        mode: 'no-cors'
      });
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (e) {
      alert("❌ Terjadi kesalahan pengiriman.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sisaKuota = Math.max(0, KUOTA_MAKSIMAL - kuotaTerdaftar);
  const persenKuota = (kuotaTerdaftar / KUOTA_MAKSIMAL) * 100;

  if (isSubmitted) {
    return (
      <div className="container mx-auto max-w-4xl py-10 px-4">
        <div className="cert-container shadow-2xl">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_Tut_Wuri_Handayani.png" 
            className="cert-watermark" 
            alt="watermark" 
            referrerPolicy="no-referrer"
          />
          
          <div className="relative z-10">
            <div className="border-b-4 border-[#1a2a6c] pb-4 text-center mb-6">
              <h2 className="text-3xl font-bold text-[#1a2a6c] uppercase">PANITIA PPDB SD ONLINE 2026</h2>
              <h4 className="text-xl font-bold text-red-600 uppercase">SDN MUARA BAKTI 01</h4>
              <p className="text-sm font-medium text-gray-500">Kecamatan Babelan, Kabupaten Bekasi, Jawa Barat</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center relative min-h-32 mb-8">
              <h3 className="text-3xl font-bold underline tracking-widest text-center w-full">BUKTI PENDAFTARAN SD</h3>
              <div className="md:absolute right-0 top-1/2 md:-translate-y-1/2 text-center mt-4 md:mt-0">
                <div className="bg-white border border-gray-200 p-2 shadow-sm">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=REG:${regNumber}|NAMA:${formData.nama}|NIK:${formData.nik}`} 
                    className="w-24 h-24 mx-auto" 
                    alt="QR Code"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-[10px] font-bold mt-1 text-gray-700">{regNumber}</div>
                </div>
              </div>
            </div>

            <div className="space-y-1 px-4">
              <div className="info-row"><div className="info-label">NOMOR REGISTRASI</div><div className="info-value text-red-700">{regNumber}</div></div>
              <div className="info-row"><div className="info-label">NAMA LENGKAP SISWA</div><div className="info-value uppercase">{formData.nama}</div></div>
              <div className="info-row"><div className="info-label">STATUS VALIDASI USIA</div><div className="info-value text-blue-700">{formData.ket_usia}</div></div>
              <div className="info-row"><div className="info-label">WAKTU DAFTAR</div><div className="info-value">{new Date().toLocaleString('id-ID')}</div></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-6">
              <div className="text-xs border border-gray-300 p-4 bg-gray-50 rounded-lg">
                <strong className="text-blue-900">PENTING:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>Simpan lembar bukti ini sebagai syarat verifikasi.</li>
                  <li>Lampirkan FC Akte Kelahiran & Kartu Keluarga.</li>
                  <li>Menyerahkan berkas asli saat verifikasi di sekolah.</li>
                </ul>
              </div>
              <div className="text-center">
                <p className="mb-1 text-sm text-gray-600">Babelan, {new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                <p className="font-bold mb-16 text-gray-800">Panitia PPDB SD,</p>
                <p className="font-bold border-t border-gray-800 w-48 mx-auto pt-1">Tanda Tangan & Cap</p>
              </div>
            </div>

            <div className="text-center mt-12 no-print flex justify-center gap-4">
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold flex items-center shadow-lg transition-colors"
                onClick={() => window.print()}
              >
                <Printer className="mr-2" /> CETAK SEKARANG
              </button>
              <button 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold transition-colors"
                onClick={() => window.location.reload()}
              >
                KEMBALI
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 pb-20">
      <div className="container mx-auto max-w-4xl pt-8 px-4">
        <div className="dashboard-card shadow-2xl">
          {/* Header Section Combined */}
          <div className="header-section">
            <div className="header-overlay"></div> 
            <div className="header-content">
              <h2 className="text-3xl md:text-4xl font-black mb-1 drop-shadow-lg uppercase">
                PENDAFTARAN PESERTA DIDIK BARU (SD)
              </h2>
              <h4 className="text-xl md:text-2xl font-bold mb-3 drop-shadow-md">
                Tahun Pelajaran 2026/2027
              </h4>
              <p className="flex items-center justify-center text-lg mt-4 opacity-100 font-medium">
                <School className="mr-2 w-6 h-6 text-yellow-300" /> 
                SDN MUARA BAKTI 01 KEC. BABELAN
              </p>
            </div>
          </div>

          {/* Registration Quota Status */}
          <div className="bg-gray-50 border-b-2 border-gray-200 p-6 no-print">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-xs uppercase text-gray-500 tracking-wider flex items-center">
                <TrendingUp className="mr-2 w-4 h-4 text-blue-500" /> Status Kuota Pendaftaran SD
              </span>
              <span className="font-black text-sm text-blue-700">
                {kuotaTerdaftar} Terdaftar
              </span>
            </div>
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${persenKuota}%` }}
                className={`h-full ${persenKuota >= 100 ? 'bg-red-500' : 'bg-green-500'} transition-colors duration-500`}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 font-medium">Daya Tampung: 56 Siswa (2 Rombel)</span>
              <span className="font-black text-red-600 efek-kedip flex items-center">
                <CircleAlert className="mr-1 w-3 h-3" /> Sisa: {sisaKuota} Kursi
              </span>
            </div>
          </div>

          {/* Age Validation Check */}
          <div className="p-6 bg-white border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center">
                  <Building2 className="mr-2 w-4 h-4 text-blue-900" /> Nama Sekolah Tujuan
                </label>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl font-bold text-blue-900">
                  SDN MUARA BAKTI 01
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h6 className="text-gray-900 font-extrabold text-sm mb-3 flex items-center">
                  <Search className="mr-2 w-4 h-4 text-blue-600" /> Validasi Usia SD (Per 1 Juli 2026)
                </h6>
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input 
                    type="date" 
                    className="w-full sm:w-auto p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-sm"
                    onChange={(e) => calculateAge(e.target.value)}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-blue-900 mb-1">{usiaValue}</div>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black text-white ${usiaStatus.class}`}>
                      {usiaStatus.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Sections */}
          <form className={`p-6 space-y-8 transition-all duration-300 ${!usiaStatus.valid ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            {/* Section I */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-container sec-anak"
            >
              <div className="section-title"><Baby className="mr-2" /> I. Identitas Peserta Didik SD</div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
                <div className="md:col-span-12">
                  <label><User className="inline mr-1 w-4 h-4" /> Nama Lengkap (Sesuai Akte)</label>
                  <input name="nama" type="text" className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" placeholder="NAMA LENGKAP SISWA" value={formData.nama} onChange={handleInputChange} required />
                </div>
                <div className="md:col-span-4">
                  <label><Users className="inline mr-1 w-4 h-4" /> Jenis Kelamin</label>
                  <select name="jk" className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" value={formData.jk} onChange={handleInputChange}>
                    <option>Laki-laki</option><option>Perempuan</option>
                  </select>
                </div>
                <div className="md:col-span-4">
                  <label><CreditCard className="inline mr-1 w-4 h-4" /> NISN (Opsional)</label>
                  <input name="nisn" type="text" className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" placeholder="10 Digit" value={formData.nisn} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-4">
                  <label><MapPin className="inline mr-1 w-4 h-4" /> Tempat Lahir</label>
                  <input name="tempat_lahir" type="text" className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" placeholder="KOTA/KABUPATEN" value={formData.tempat_lahir} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-4">
                  <label><Calendar className="inline mr-1 w-4 h-4" /> Tanggal Lahir</label>
                  <input name="tgl_lahir" type="date" className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-100 outline-none" value={formData.tgl_lahir} readOnly />
                </div>
                <div className="md:col-span-4">
                  <label><Contact className="inline mr-1 w-4 h-4" /> NIK Siswa (16 Digit)</label>
                  <input name="nik" type="number" maxLength={16} className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" placeholder="3216xxxxxxxxxxxx" value={formData.nik} onChange={handleNumericInput} />
                </div>
                <div className="md:col-span-4">
                  <label><BookOpen className="inline mr-1 w-4 h-4" /> No. Kartu Keluarga</label>
                  <input name="no_kk" type="number" maxLength={16} className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none" placeholder="3216xxxxxxxxxxxx" value={formData.no_kk} onChange={handleNumericInput} />
                </div>
              </div>
            </motion.div>

            {/* Section II: Parents */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-container sec-ortu"
            >
              <div className="section-title"><Users className="mr-2" /> II. Identitas Orang Tua</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div className="space-y-3">
                  <h6 className="font-black text-blue-700 underline flex items-center">
                    <UserCircle className="mr-1 w-4 h-4" /> DATA AYAH KANDUNG
                  </h6>
                  <input name="ayah_nama" placeholder="NAMA LENGKAP AYAH" className="w-full p-2.5 rounded-lg border border-gray-200" value={formData.ayah_nama} onChange={handleInputChange} />
                  <input name="ayah_nik" type="number" maxLength={16} placeholder="NIK AYAH (16 DIGIT)" className="w-full p-2.5 rounded-lg border border-gray-200" value={formData.ayah_nik} onChange={handleNumericInput} />
                  <div className="flex gap-2">
                    <label className="w-full">
                      Pekerjaan Ayah
                      <select name="ayah_kerja" className="w-full p-2 rounded-lg mt-1 border border-gray-200" value={formData.ayah_kerja} onChange={handleInputChange}>
                        <option value="">-- PILIH --</option>
                        <option>Wiraswasta</option><option>Karyawan Swasta</option><option>Buruh</option><option>Pedagang</option>
                        <option>Petani</option><option>PNS/TNI/Polri</option><option>Guru</option><option>Lainnya</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div className="space-y-3">
                  <h6 className="font-black text-pink-700 underline flex items-center">
                    <UserCircle className="mr-1 w-4 h-4" /> DATA IBU KANDUNG
                  </h6>
                  <input name="ibu_nama" placeholder="NAMA LENGKAP IBU" className="w-full p-2.5 rounded-lg border border-gray-200" value={formData.ibu_nama} onChange={handleInputChange} />
                  <input name="ibu_nik" type="number" maxLength={16} placeholder="NIK IBU (16 DIGIT)" className="w-full p-2.5 rounded-lg border border-gray-200" value={formData.ibu_nik} onChange={handleNumericInput} />
                  <div className="flex gap-2">
                    <label className="w-full">
                      Pekerjaan Ibu
                      <select name="ibu_kerja" className="w-full p-2 rounded-lg mt-1 border border-gray-200" value={formData.ibu_kerja} onChange={handleInputChange}>
                        <option value="">-- PILIH --</option>
                        <option>IRT (Ibu Rumah Tangga)</option><option>Karyawan Swasta</option><option>Pedagang</option>
                        <option>Buruh</option><option>Wiraswasta</option><option>PNS/TNI/Polri</option><option>Lainnya</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Section III: Periodik */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-container sec-periodik"
            >
              <div className="section-title"><Stethoscope className="mr-2" /> III. Data Periodik</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <label><Flag className="inline mr-1 w-4 h-4" /> Masuk Di Kelas</label>
                  <input className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-100 font-bold" value={formData.kelas} readOnly />
                </div>
                <div>
                  <label><Ruler className="inline mr-1 w-4 h-4" /> Tinggi Badan (cm)</label>
                  <input name="tb" type="number" className="w-full p-2.5 rounded-lg border border-gray-200" placeholder="110" value={formData.tb} onChange={handleNumericInput} />
                </div>
                <div>
                  <label><Navigation className="inline mr-1 w-4 h-4" /> Jarak ke Sekolah</label>
                  <select name="jarak" className="w-full p-2.5 rounded-lg border border-gray-200" value={formData.jarak} onChange={handleInputChange}>
                    <option value="">-- PILIH --</option>
                    <option>Kurang dari 1 km</option>
                    <option>1 – 5 km</option>
                    <option>5 – 10 km</option>
                    <option>Lebih dari 15 km</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label><Home className="inline mr-1 w-4 h-4" /> Alamat Rumah Lengkap</label>
                  <input name="alamat" type="text" className="w-full p-2.5 rounded-lg border border-gray-200" placeholder="JALAN, RT/RW, DUSUN/KAMPUNG" value={formData.alamat} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-3">
                  <label><MessageCircle className="inline mr-1 w-4 h-4" /> No. HP Orang Tua (WhatsApp Aktif)</label>
                  <input name="hp" type="text" className="w-full p-2.5 rounded-lg border border-gray-200" placeholder="08XXXXXXXXXX" value={formData.hp} onChange={handleInputChange} />
                </div>
              </div>
            </motion.div>

            <button 
              type="button" 
              className={`btn-simpan ${isSubmitting || kuotaTerdaftar >= KUOTA_MAKSIMAL ? 'opacity-50 cursor-not-allowed grayscale' : ''}`} 
              onClick={handleSubmit}
              disabled={isSubmitting || kuotaTerdaftar >= KUOTA_MAKSIMAL}
            >
              {isSubmitting ? (
                <>Loading...</>
              ) : kuotaTerdaftar >= KUOTA_MAKSIMAL ? (
                <>MAAF, KUOTA SD PENUH</>
              ) : (
                <><Save className="inline-block mr-2" /> SIMPAN DATA & CETAK BUKTI SD</>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-12 text-gray-400 text-sm no-print">
          <p>&copy; 2026 <strong>SDN MUARA BAKTI 01</strong>. All Rights Reserved.</p>
          <small className="mt-1 block">Sistem Informasi PPDB Digital v2.0</small>
        </div>
      </div>
    </div>
  );
}

function MessageCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
