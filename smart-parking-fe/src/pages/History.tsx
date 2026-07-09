import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';

import VehicleBadge from '../components/VehicleBadge';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import { parkingApi } from '../api/parking';
import type { RiwayatResponse, RiwayatItem } from '../types/parking';
import { formatRupiah, formatDurasi, formatWaktu } from '../utils/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faTriangleExclamation, faPrint, faArrowsRotate, faCircleInfo, faCircleCheck, faBolt, faFileArrowDown, faFloppyDisk, faMoneyBill, faCalculator, faFileLines, faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons';

const History: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [data, setData] = useState<RiwayatResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterPlat, setFilterPlat] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRiwayat, setSelectedRiwayat] = useState<RiwayatItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRiwayat = useCallback(async (tanggal: string, jenis: string, plat: string) => {
    setLoading(true);
    try {
      const res = await parkingApi.getRiwayat(tanggal, jenis, plat);
      setData(res.data);
      setError('');
    } catch (err: any) {
      setError('Gagal memuat data riwayat');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchRiwayat('', '', '');
  }, [fetchRiwayat]);

  // Live search: auto-fetch with debounce whenever any filter changes
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchRiwayat(filterTanggal, filterJenis, filterPlat);
    }, 400); // 400ms debounce
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [filterTanggal, filterJenis, filterPlat, fetchRiwayat]);

  const handleResetFilter = () => {
    setFilterTanggal('');
    setFilterJenis('');
    setFilterPlat('');
  };

  const handleDeleteClick = (item: RiwayatItem) => {
    setSelectedRiwayat(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRiwayat || !user) return;
    setDeleting(true);
    try {
      await parkingApi.deleteRiwayat(selectedRiwayat.id, user.role);
      setShowDeleteModal(false);
      setSelectedRiwayat(null);
      await fetchRiwayat(filterTanggal, filterJenis, filterPlat);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Gagal menghapus data riwayat');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 print:bg-white print:p-0 print:m-0">
      <div className="print:hidden">
        <Navbar title="Riwayat Parkir" showBack={true} />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-full">
        {/* --- PRINT ONLY HEADER --- */}
        <div className="hidden print:block mb-8 border-b-2 border-gray-800 pb-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-gray-900">LAPORAN RIWAYAT PARKIR</h1>
              <p className="text-gray-500 mt-1">Sistem Manajemen Parkir Cerdas</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">Tanggal Cetak:</p>
              <p className="text-gray-600">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>

        <div className="print:hidden">
          {error && (
            <div className="bg-red-600 text-white p-3 rounded-lg mb-6 shadow-sm text-sm flex items-center gap-2">
              <span className="relative flex items-center justify-center">
                <span className="absolute w-1 h-2 bg-black mt-0.5 z-0 rounded-sm"></span>
                <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-500 text-base relative z-10" />
              </span> 
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>

        {data && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 print:flex print:justify-between print:gap-8 print:mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 print:border-2 print:border-gray-300 print:shadow-none print:w-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-500 font-medium print:text-gray-700">Total Transaksi</h3>
                  <span className="text-2xl text-blue-500 print:hidden"><FontAwesomeIcon icon={faFileLines} /></span>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{data.totalTransaksi}</div>
                <div className="text-sm text-gray-400 print:hidden">{data.totalTransaksi} data sesuai filter</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 print:border-2 print:border-gray-300 print:shadow-none print:w-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-500 font-medium print:text-gray-700">Total Pendapatan</h3>
                  <span className="text-2xl text-green-500 print:hidden"><FontAwesomeIcon icon={faMoneyBill} /></span>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{formatRupiah(data.totalPendapatan)}</div>
                <div className="text-sm text-gray-400 print:hidden">Semua waktu</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 print:border-2 print:border-gray-300 print:shadow-none print:w-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-500 font-medium print:text-gray-700">Rata-rata per Transaksi</h3>
                  <span className="text-2xl text-purple-500 print:hidden"><FontAwesomeIcon icon={faCalculator} /></span>
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-1">{formatRupiah(data.rataRata)}</div>
                <div className="text-sm text-gray-400 print:hidden">Rata-rata biaya parkir</div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 print:block">
              <div className="xl:col-span-3 space-y-6 print:space-y-0">
                {/* Filter Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 print:hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800"><FontAwesomeIcon icon={faMagnifyingGlass} /> Filter & Pencarian Langsung</h3>
                    {loading && <span className="text-xs text-orange-500 animate-pulse font-medium">Memuat...</span>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="date"
                      value={filterTanggal}
                      onChange={(e) => setFilterTanggal(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
                    />
                    <select
                      value={filterJenis}
                      onChange={(e) => setFilterJenis(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
                    >
                      <option value="">Semua Jenis</option>
                      <option value="Motor">Motor</option>
                      <option value="Mobil">Mobil</option>
                    </select>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
                      <input
                        type="text"
                        placeholder="Ketik plat nomor..."
                        value={filterPlat}
                        onChange={(e) => setFilterPlat(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none uppercase"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">Hasil otomatis diperbarui saat kamu mengetik</p>
                    {(filterTanggal || filterJenis || filterPlat) && (
                      <button onClick={handleResetFilter} className="px-4 py-1.5 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                        <FontAwesomeIcon icon={faArrowsRotate} /> Reset Filter
                      </button>
                    )}
                  </div>
                </div>

                {/* Chart Card */}
                <div className="print:hidden">
                  {data.chart7Hari && data.chart7Hari.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
                      <h3 className="font-bold text-gray-800 mb-6"><FontAwesomeIcon icon={faChartSimple} /> Transaksi 7 Hari Terakhir</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.chart7Hari}>
                          <XAxis dataKey="tanggal" fontSize={12} tickMargin={10} />
                          <YAxis fontSize={12} />
                          <Tooltip 
                            formatter={(value: any, name: any) => [
                              name === 'pendapatan' ? formatRupiah(Number(value)) : value, 
                              name === 'pendapatan' ? 'Pendapatan' : 'Jumlah'
                            ]}
                          />
                          <Bar dataKey="jumlah" fill="#F97316" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none print:mt-8">
                  <div className="hidden print:block mb-4 font-bold text-lg text-gray-800">Rincian Transaksi:</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                        <tr>
                          <th className="px-5 py-3">Plat Nomor</th>
                          <th className="px-5 py-3">Jenis</th>
                          <th className="px-5 py-3">Waktu Masuk</th>
                          <th className="px-5 py-3">Waktu Keluar</th>
                          <th className="px-5 py-3">Durasi</th>
                          <th className="px-5 py-3">Total Bayar</th>
                          {isAdmin && <th className="px-5 py-3 print:hidden">Aksi</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {loading ? (
                          <tr><td colSpan={isAdmin ? 7 : 6} className="px-5 py-8 text-center text-gray-500">Loading...</td></tr>
                        ) : data.transaksi.length === 0 ? (
                          <tr><td colSpan={isAdmin ? 7 : 6} className="px-5 py-8 text-center text-gray-500">Tidak ada riwayat parkir yang ditemukan.</td></tr>
                        ) : (
                          data.transaksi.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-4 font-bold text-gray-900">{item.platNomor}</td>
                              <td className="px-5 py-4"><VehicleBadge jenis={item.jenis} /></td>
                              <td className="px-5 py-4 whitespace-nowrap text-gray-600">{formatWaktu(item.waktuMasuk)}</td>
                              <td className="px-5 py-4 whitespace-nowrap text-gray-600">{formatWaktu(item.waktuKeluar)}</td>
                              <td className="px-5 py-4 text-gray-600">{formatDurasi(item.durasiMenit)}</td>
                              <td className="px-5 py-4 font-bold text-gray-900">{formatRupiah(item.totalBayar)}</td>
                              {isAdmin && (
                                <td className="px-5 py-4 print:hidden">
                                  <button
                                    onClick={() => handleDeleteClick(item)}
                                    title="Hapus riwayat"
                                    className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Side Panel Area */}
              <div className="xl:col-span-1 space-y-6 print:hidden">
                <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
                  <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                    <span><FontAwesomeIcon icon={faCircleInfo} /></span> Informasi Riwayat
                  </h3>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li className="flex items-start gap-2"><span><FontAwesomeIcon icon={faCircleCheck} /></span> <span>Semua transaksi parkir yang selesai akan tercatat di sini</span></li>
                    <li className="flex items-start gap-2"><span><FontAwesomeIcon icon={faCircleCheck} /></span> <span>Gunakan filter untuk mencari data spesifik</span></li>
                    <li className="flex items-start gap-2"><span><FontAwesomeIcon icon={faCircleCheck} /></span> <span>Chart menampilkan aktivitas 7 hari terakhir</span></li>
                    <li className="flex items-start gap-2 text-gray-500 font-medium mt-3 border-t border-yellow-200/50 pt-2">
                      <span><FontAwesomeIcon icon={faFileArrowDown} /></span> <span>Data dapat diekspor ke CSV</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                   <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2"><span className="text-yellow-500 drop-shadow-sm"><FontAwesomeIcon icon={faBolt} /></span> Aksi Cepat</h3>
                   </div>
                   <div className="p-2 space-y-1">
                     <a href={parkingApi.exportExcelUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium w-full text-left transition-colors">
                      <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                        <FontAwesomeIcon icon={faFloppyDisk} />
                      </div>
                      Export Excel
                    </a>
                     <button onClick={() => window.print()} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium w-full text-left transition-colors">
                        <span className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 text-lg"><FontAwesomeIcon icon={faPrint} /></span>
                        Print Data
                     </button>
                   </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <ConfirmModal
        show={showDeleteModal}
        title="Hapus Riwayat Parkir?"
        body={
          selectedRiwayat ? (
            <div className="text-left bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-100 mx-auto max-w-xs">
              <p><strong>Plat:</strong> {selectedRiwayat.platNomor} ({selectedRiwayat.jenis})</p>
              <p><strong>Keluar:</strong> {formatWaktu(selectedRiwayat.waktuKeluar)}</p>
              <p><strong>Total Bayar:</strong> {formatRupiah(selectedRiwayat.totalBayar)}</p>
              <p className="text-red-500 font-medium pt-2 border-t mt-2">Data yang dihapus tidak dapat dikembalikan.</p>
            </div>
          ) : null
        }
        confirmText={deleting ? 'Menghapus...' : 'Ya, Hapus'}
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => { setShowDeleteModal(false); setSelectedRiwayat(null); }}
      />
    </div>
  );
};

export default History;
