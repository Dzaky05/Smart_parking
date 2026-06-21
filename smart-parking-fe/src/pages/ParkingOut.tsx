import React, { useState, useEffect, useRef } from 'react';

import Navbar from '../components/Navbar';

import ConfirmModal from '../components/ConfirmModal';
import { parkingApi } from '../api/parking';
import type { KendaraanAktif, StrukData } from '../types/parking';
import { hitungEstimasi, formatRupiah, formatDurasi, formatWaktu } from '../utils/format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide, faMotorcycle, faClipboardList, faTriangleExclamation, faCheck, faPrint, faArrowsRotate, faCircleInfo, faCircleCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const ParkingOut: React.FC = () => {
  const [kendaraanList, setKendaraanList] = useState<KendaraanAktif[]>([]);
  const [selectedId, setSelectedId] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [struk, setStruk] = useState<StrukData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toISOString());

  // Real-time update for estimation
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toISOString()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchKendaraanAktif = async () => {
    try {
      const res = await parkingApi.getKendaraanAktif();
      setKendaraanList(res.data);
    } catch (err: any) {
      setError('Gagal memuat data kendaraan aktif');
    }
  };

  useEffect(() => {
    fetchKendaraanAktif();
  }, []);

  // Filter results based on search query, limit to 5
  const filteredList = kendaraanList.filter(k =>
    k.platNomor.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  // Show top 3 recommendations when no search query
  const recommendations = kendaraanList.slice(0, 3);

  const selectedKendaraan = kendaraanList.find(k => k.id === selectedId);

  const handleSelectKendaraan = (k: KendaraanAktif) => {
    setSelectedId(k.id);
    setSearchQuery(k.platNomor);
    setShowDropdown(false);
  };

  const handleProcess = () => {
    if (!selectedId) {
      setError('Pilih kendaraan terlebih dahulu');
      return;
    }
    setError('');
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedId) return;
    

    try {
      const res = await parkingApi.postKeluar({ id: Number(selectedId) });
      setStruk(res.data);
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memproses parkir keluar');
      setShowModal(false);
    } finally {

    }
  };

  const handleReset = () => {
    setStruk(null);
    setSelectedId('');
    setSearchQuery('');
    setError('');
    fetchKendaraanAktif();
  };

  const handleCopy = () => {
    if (!struk) return;
    const text = `
Struk Parkir Smart Parking
---------------------------
Plat Nomor : ${struk.platNomor}
Jenis      : ${struk.jenis}
Masuk      : ${formatWaktu(struk.waktuMasuk)}
Keluar     : ${formatWaktu(struk.waktuKeluar)}
Durasi     : ${struk.durasiMenit} menit
---------------------------
Total Bayar: ${formatRupiah(struk.totalBayar)}
    `.trim();
    navigator.clipboard.writeText(text);
    alert('Struk disalin ke clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 print:bg-white print:min-h-0 print:pb-0">
      {/* --- PRINT ONLY VIEW --- */}
      {struk && (
        <div className="hidden print:block text-black font-sans p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-end border-b-2 border-gray-800 pb-6 mb-8">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">SMART PARKING</h1>
              <p className="text-gray-500 mt-2 text-lg">Bukti Pembayaran Resmi</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl text-gray-800">INVOICE</p>
              <p className="text-gray-500 mt-1">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Informasi Kendaraan</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-3xl font-black text-gray-900 mb-1">{struk.platNomor}</p>
                <p className="text-lg text-gray-600 font-medium">{struk.jenis}</p>
              </div>
            </div>
            <div>
              <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Waktu Parkir</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Masuk</span>
                  <span className="font-bold text-gray-900">{formatWaktu(struk.waktuMasuk)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Keluar</span>
                  <span className="font-bold text-gray-900">{formatWaktu(struk.waktuKeluar)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                  <span className="text-gray-600">Total Durasi</span>
                  <span className="font-bold text-gray-900">{formatDurasi(struk.durasiMenit)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-4">Rincian Biaya</h3>
          <table className="w-full mb-12">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 bg-gray-100 font-bold text-gray-800 rounded-tl-lg">Keterangan</th>
                <th className="text-right py-3 px-4 bg-gray-100 font-bold text-gray-800">Tarif per Jam</th>
                <th className="text-right py-3 px-4 bg-gray-100 font-bold text-gray-800">Lama (Jam)</th>
                <th className="text-right py-3 px-4 bg-gray-100 font-bold text-gray-800 rounded-tr-lg">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-4 text-gray-800">Biaya Parkir ({struk.jenis})</td>
                <td className="text-right py-4 px-4 text-gray-600">{formatRupiah(struk.tarifPerJam)}</td>
                <td className="text-right py-4 px-4 text-gray-600">{struk.lamaJam} jam</td>
                <td className="text-right py-4 px-4 text-gray-800 font-medium">{formatRupiah(struk.totalBayar)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-right py-6 px-4 font-bold text-xl text-gray-800">TOTAL BAYAR</td>
                <td className="text-right py-6 px-4 font-black text-2xl text-gray-900 bg-gray-50 rounded-b-lg border-b-4 border-gray-800">{formatRupiah(struk.totalBayar)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="mt-16 text-center text-gray-500 border-t border-gray-200 pt-8">
            <p className="font-medium text-lg mb-1">Terima Kasih Atas Kunjungan Anda</p>
            <p className="text-sm">Dokumen ini sah sebagai bukti pembayaran parkir yang valid.</p>
          </div>
        </div>
      )}

      {/* --- SCREEN ONLY VIEW --- */}
      <div className="print:hidden">
        <Navbar title="Parkir Keluar" showBack={true} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Area */}
          <div className="lg:col-span-2">
            {!struk ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-br from-red-500 to-red-400 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span><FontAwesomeIcon icon={faCarSide} /></span> Cari Kendaraan Keluar
                  </h2>
                  <p className="text-red-100 mt-1 text-sm">Cari berdasarkan plat nomor kendaraan</p>
                </div>

                <div className="p-6">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 border border-red-200 text-sm">
                      <FontAwesomeIcon icon={faTriangleExclamation} /> {error}
                    </div>
                  )}

                  <div className="mb-6" ref={dropdownRef}>
                    <label className="block text-red-500 font-bold mb-2"><FontAwesomeIcon icon={faMagnifyingGlass} /> Cari Plat Nomor Kendaraan *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400"><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value.toUpperCase());
                          setSelectedId('');
                          setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-400 focus:ring-0 outline-none text-lg font-bold uppercase transition-colors"
                        placeholder="KETIK PLAT NOMOR... (CONTOH: B 1234 ABC)"
                      />
                    </div>

                    {/* Dropdown results */}
                    {showDropdown && (
                      <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10 relative">
                        {searchQuery ? (
                          filteredList.length > 0 ? (
                            <>
                              <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 font-medium border-b border-gray-100">
                                Hasil pencarian ({filteredList.length} ditemukan)
                              </div>
                              {filteredList.map((k) => (
                                <button
                                  key={k.id}
                                  onClick={() => handleSelectKendaraan(k)}
                                  className={`w-full text-left px-4 py-3 hover:bg-red-50 transition-colors border-b border-gray-50 last:border-b-0 flex justify-between items-center ${selectedId === k.id ? 'bg-red-50' : ''}`}
                                >
                                  <div>
                                    <span className="font-bold text-gray-800">{k.platNomor}</span>
                                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${k.jenis === 'Motor' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                      {k.jenis}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">Masuk: {formatWaktu(k.waktuMasuk).split(' ')[1]}</span>
                                </button>
                              ))}
                            </>
                          ) : (
                            <div className="px-4 py-6 text-center text-gray-400 text-sm">
                              Kendaraan dengan plat "{searchQuery}" tidak ditemukan
                            </div>
                          )
                        ) : (
                          <>
                            <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 font-medium border-b border-gray-100">
                              Rekomendasi kendaraan terakhir masuk
                            </div>
                            {recommendations.length > 0 ? recommendations.map((k) => (
                              <button
                                key={k.id}
                                onClick={() => handleSelectKendaraan(k)}
                                className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors border-b border-gray-50 last:border-b-0 flex justify-between items-center"
                              >
                                <div>
                                  <span className="font-bold text-gray-800">{k.platNomor}</span>
                                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${k.jenis === 'Motor' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {k.jenis}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">Masuk: {formatWaktu(k.waktuMasuk).split(' ')[1]}</span>
                              </button>
                            )) : (
                              <div className="px-4 py-6 text-center text-gray-400 text-sm">
                                Belum ada kendaraan yang sedang parkir
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedKendaraan && (
                    <div className="mb-8 animate-in fade-in slide-in-from-bottom-2">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-500 text-sm mb-1">Durasi Parkir</p>
                            <p className="font-bold text-xl text-gray-800">
                              {(() => {
                                const msk = new Date(selectedKendaraan.waktuMasuk).getTime();
                                const now = new Date(currentTime).getTime();
                                return formatDurasi(Math.floor((now - msk) / 60000));
                              })()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500 text-sm mb-1">Estimasi Biaya</p>
                            <p className="font-bold text-2xl text-red-500">
                              {formatRupiah(hitungEstimasi(selectedKendaraan.waktuMasuk, selectedKendaraan.jenis))}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-yellow-200/50 text-xs text-gray-500 flex items-center gap-1.5">
                          <span><FontAwesomeIcon icon={faCircleInfo} /></span> Perhitungan berdasarkan durasi parkir dan tarif per jam
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={handleProcess}
                      className="flex-[2] bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 text-white font-bold py-3.5 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <span>→</span> Proses Parkir Keluar
                    </button>
                    <button
                      onClick={() => { setSelectedId(''); setSearchQuery(''); }}
                      className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <span>×</span> Batal
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Inline Struk View */
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 max-w-sm mx-auto">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl"><FontAwesomeIcon icon={faCheck} /></div>
                    <h2 className="text-xl font-bold text-gray-900">Transaksi Berhasil</h2>
                    <p className="text-sm text-gray-500">Bukti pembayaran parkir</p>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 mb-6">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-gray-100">
                        <tr><td className="py-2 text-gray-500">Plat Nomor</td><td className="py-2 font-bold text-right">{struk.platNomor}</td></tr>
                        <tr><td className="py-2 text-gray-500">Jenis Kendaraan</td><td className="py-2 font-medium text-right">{struk.jenis}</td></tr>
                        <tr><td className="py-2 text-gray-500">Waktu Masuk</td><td className="py-2 font-medium text-right">{formatWaktu(struk.waktuMasuk)}</td></tr>
                        <tr><td className="py-2 text-gray-500">Waktu Keluar</td><td className="py-2 font-medium text-right">{formatWaktu(struk.waktuKeluar)}</td></tr>
                        <tr><td className="py-2 text-gray-500">Durasi Parkir</td><td className="py-2 font-medium text-right">{formatDurasi(struk.durasiMenit)}</td></tr>
                      </tbody>
                    </table>
                    
                    <div className="my-3 border-t-2 border-dashed border-gray-200"></div>
                    
                    <table className="w-full text-sm">
                      <tbody>
                        <tr><td className="py-1 text-gray-500">Tarif per Jam</td><td className="py-1 text-right">{formatRupiah(struk.tarifPerJam)}</td></tr>
                        <tr><td className="py-1 text-gray-500">Lama Parkir</td><td className="py-1 text-right">{struk.lamaJam} jam</td></tr>
                        <tr><td className="py-3 font-bold text-base text-gray-900">TOTAL BAYAR</td><td className="py-3 font-bold text-xl text-brand-orange text-right">{formatRupiah(struk.totalBayar)}</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="text-center text-xs text-gray-400 italic mb-8">
                    <p>Terima kasih atas kunjungan Anda</p>
                    <p>Struk ini sah sebagai bukti pembayaran</p>
                    <p className="mt-2">{new Date().toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button onClick={() => window.print()} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                      <span><FontAwesomeIcon icon={faPrint} /></span> Cetak Struk
                    </button>
                    <button onClick={handleCopy} className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 flex items-center justify-center gap-2">
                      <span><FontAwesomeIcon icon={faClipboardList} /></span> Salin Struk
                    </button>
                    <button onClick={handleReset} className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 flex items-center justify-center gap-2">
                      <span><FontAwesomeIcon icon={faArrowsRotate} /></span> Transaksi Baru
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Side Panel Area */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
              <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                <span><FontAwesomeIcon icon={faCircleInfo} /></span> Informasi Parkir Keluar
              </h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start gap-2"><span><FontAwesomeIcon icon={faCircleCheck} /></span> <span>Pastikan plat nomor sesuai dengan fisik kendaraan</span></li>
                <li className="flex items-start gap-2"><span><FontAwesomeIcon icon={faCircleCheck} /></span> <span>Tarif dihitung otomatis berdasarkan waktu masuk</span></li>
                <li className="flex items-start gap-2"><span><FontAwesomeIcon icon={faCircleCheck} /></span> <span>Pembayaran dapat dilakukan setelah struk keluar</span></li>
                <li className="flex items-start gap-2"><span><FontAwesomeIcon icon={faCircleCheck} /></span> <span>Data transaksi akan tersimpan di riwayat</span></li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-gray-800">Tarif Parkir per Jam</h3>
               </div>
               <div className="p-4 space-y-3">
                 <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                   <div className="flex items-center gap-2 text-gray-700 font-medium"><span className="text-pink-500"><FontAwesomeIcon icon={faMotorcycle} /></span> Motor</div>
                   <div className="font-bold text-gray-900">Rp 2.000<span className="text-xs text-gray-500 font-normal">/jam</span></div>
                 </div>
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2 text-gray-700 font-medium"><span className="text-blue-500"><FontAwesomeIcon icon={faCarSide} /></span> Mobil</div>
                   <div className="font-bold text-gray-900">Rp 5.000<span className="text-xs text-gray-500 font-normal">/jam</span></div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal
        show={showModal}
        title="Konfirmasi Parkir Keluar"
        body={
          selectedKendaraan ? (
            <div className="text-left bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-100 mx-auto max-w-xs">
              <p><strong>Plat:</strong> {selectedKendaraan.platNomor} ({selectedKendaraan.jenis})</p>
              <p><strong>Masuk:</strong> {formatWaktu(selectedKendaraan.waktuMasuk).split(' ')[1]}</p>
              <p><strong>Durasi:</strong> {formatDurasi(Math.floor((new Date(currentTime).getTime() - new Date(selectedKendaraan.waktuMasuk).getTime()) / 60000))}</p>
              <p className="text-red-500 font-bold pt-2 border-t mt-2">Estimasi: {formatRupiah(hitungEstimasi(selectedKendaraan.waktuMasuk, selectedKendaraan.jenis))}</p>
            </div>
          ) : null
        }
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
      />
      </div>
    </div>
  );
};

export default ParkingOut;
