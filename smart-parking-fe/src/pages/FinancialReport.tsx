import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { parkingApi } from '../api/parking';
import type { RiwayatResponse } from '../types/parking';
import { formatRupiah } from '../utils/format';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide, faMotorcycle, faMoneyBillWave, faChartSimple, faTriangleExclamation, faPrint, faArrowsRotate, faCircleInfo, faCircleCheck, faBolt, faFileArrowDown, faChartLine, faCaretDown, faCalculator, faCalendarDay, faFileLines } from '@fortawesome/free-solid-svg-icons';

interface DailyReport {
  tanggal: string;
  jumlah: number;
  pendapatan: number;
}

const FinancialReport: React.FC = () => {
  const [data, setData] = useState<RiwayatResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterBulan, setFilterBulan] = useState('');
  const [chartType, setChartType] = useState<'bar' | 'area'>('area');

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await parkingApi.getRiwayat(filterBulan, '', '');
      setData(res.data);
      setError('');
    } catch (err: any) {
      setError('Gagal memuat data report keuangan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleApplyFilter = () => {
    fetchReport();
  };

  const handleResetFilter = () => {
    setFilterBulan('');
    setTimeout(() => {
      parkingApi.getRiwayat('', '', '').then(res => setData(res.data)).catch(() => setError('Error'));
    }, 0);
  };

  // Calculate additional stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransaksi = data?.transaksi.filter(t => t.waktuKeluar?.startsWith(todayStr)) || [];
  const pendapatanHariIni = todayTransaksi.reduce((sum, t) => sum + t.totalBayar, 0);
  const transaksiHariIni = todayTransaksi.length;

  // Build daily report data from transactions
  const dailyMap = new Map<string, DailyReport>();
  data?.transaksi.forEach(t => {
    const tgl = t.waktuKeluar ? t.waktuKeluar.substring(0, 10) : '';
    if (!tgl) return;
    const existing = dailyMap.get(tgl) || { tanggal: tgl, jumlah: 0, pendapatan: 0 };
    existing.jumlah += 1;
    existing.pendapatan += t.totalBayar;
    dailyMap.set(tgl, existing);
  });
  const dailyReport = Array.from(dailyMap.values()).sort((a, b) => a.tanggal.localeCompare(b.tanggal));
  const last7Days = dailyReport.slice(-7);

  // Motor vs Mobil breakdown
  const motorCount = data?.transaksi.filter(t => t.jenis === 'Motor').length || 0;
  const mobilCount = data?.transaksi.filter(t => t.jenis === 'Mobil').length || 0;
  const motorRevenue = data?.transaksi.filter(t => t.jenis === 'Motor').reduce((s, t) => s + t.totalBayar, 0) || 0;
  const mobilRevenue = data?.transaksi.filter(t => t.jenis === 'Mobil').reduce((s, t) => s + t.totalBayar, 0) || 0;

  const formatTanggalShort = (tgl: string) => {
    const d = new Date(tgl);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 print:bg-white print:p-0 print:m-0">
      <div className="print:hidden">
        <Navbar title="Report Keuangan" showBack={true} />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-full">
        {/* --- PRINT ONLY HEADER --- */}
        <div className="hidden print:block mb-8 border-b-2 border-gray-800 pb-4 mt-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-gray-900">LAPORAN KEUANGAN PARKIR</h1>
              <p className="text-gray-500 mt-1">Sistem Manajemen Parkir Cerdas</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">Periode Laporan:</p>
              <p className="text-gray-600">{filterBulan ? filterBulan : 'Semua Waktu'} - Dicetak: {new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>
        </div>

        <div className="print:hidden">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200">
              <FontAwesomeIcon icon={faTriangleExclamation} /> {error}
            </div>
          )}
        </div>

        {loading && !data ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
          </div>
        ) : data && (
          <>
            {/* Stat Cards - Premium Design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print:flex print:justify-between print:gap-4 print:mb-8">
              {/* Total Pendapatan */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden print:border-2 print:border-gray-300 print:shadow-none print:bg-none print:text-gray-800 print:w-full">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 print:hidden"></div>
                <div className="relative">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-orange-100 font-medium text-sm print:text-gray-500">Total Pendapatan</h3>
                    <span className="text-2xl print:hidden"><FontAwesomeIcon icon={faMoneyBillWave} /></span>
                  </div>
                  <div className="text-2xl font-extrabold mb-1 print:text-gray-900">{formatRupiah(data.totalPendapatan)}</div>
                  <div className="text-xs text-orange-200 print:hidden">Seluruh periode</div>
                </div>
              </div>

              {/* Total Transaksi */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden print:border-2 print:border-gray-300 print:shadow-none print:w-full">
                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 print:hidden"></div>
                <div className="relative">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-gray-500 font-medium text-sm">Total Transaksi</h3>
                    <span className="text-2xl print:hidden"><FontAwesomeIcon icon={faFileLines} /></span>
                  </div>
                  <div className="text-2xl font-extrabold text-gray-800 mb-1">{data.totalTransaksi}</div>
                  <div className="text-xs text-gray-400 print:hidden">Semua transaksi selesai</div>
                </div>
              </div>

              {/* Rata-rata */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden print:border-2 print:border-gray-300 print:shadow-none print:w-full">
                <div className="absolute top-0 right-0 w-16 h-16 bg-purple-50 rounded-full -translate-y-1/2 translate-x-1/2 print:hidden"></div>
                <div className="relative">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-gray-500 font-medium text-sm">Rata-rata / Transaksi</h3>
                    <span className="text-2xl print:hidden"><FontAwesomeIcon icon={faCalculator} /></span>
                  </div>
                  <div className="text-2xl font-extrabold text-gray-800 mb-1">{formatRupiah(data.rataRata)}</div>
                  <div className="text-xs text-gray-400 print:hidden">Per transaksi parkir</div>
                </div>
              </div>

              {/* Pendapatan Hari Ini */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden print:border-2 print:border-gray-300 print:shadow-none print:w-full">
                <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2 print:hidden"></div>
                <div className="relative">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-gray-500 font-medium text-sm">Hari Ini</h3>
                    <span className="text-2xl print:hidden"><FontAwesomeIcon icon={faCalendarDay} /></span>
                  </div>
                  <div className="text-2xl font-extrabold text-green-600 mb-1 print:text-gray-900">{formatRupiah(pendapatanHariIni)}</div>
                  <div className="text-xs text-gray-400 print:hidden">{transaksiHariIni} transaksi hari ini</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 print:block">
              {/* Main Content */}
              <div className="xl:col-span-3 space-y-6 print:space-y-0">
                {/* Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 print:hidden">
                  <h3 className="font-bold text-gray-800 mb-4"><FontAwesomeIcon icon={faCaretDown} /> Filter Laporan</h3>
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-sm text-gray-600 mb-1">Tanggal</label>
                      <input
                        type="date"
                        value={filterBulan}
                        onChange={(e) => setFilterBulan(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
                      />
                    </div>
                    <button onClick={handleApplyFilter} className="px-6 py-2 bg-brand-orange text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                      🔍 Terapkan
                    </button>
                    <button onClick={handleResetFilter} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      <FontAwesomeIcon icon={faArrowsRotate} /> Reset
                    </button>
                  </div>
                </div>

                {/* Chart - Pendapatan */}
                <div className="print:hidden">
                  {last7Days.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800"><FontAwesomeIcon icon={faChartLine} /> Grafik Pendapatan (7 Hari Terakhir)</h3>
                        <div className="flex bg-gray-100 rounded-lg p-0.5">
                          <button
                            onClick={() => setChartType('area')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${chartType === 'area' ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            Area
                          </button>
                          <button
                            onClick={() => setChartType('bar')}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${chartType === 'bar' ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            Bar
                          </button>
                        </div>
                      </div>
                      <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          {chartType === 'area' ? (
                            <AreaChart data={last7Days}>
                              <defs>
                                <linearGradient id="colorPendapatan" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="tanggal" fontSize={12} tickMargin={10} tickFormatter={formatTanggalShort} />
                              <YAxis fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                              <Tooltip
                                formatter={(value: any) => [formatRupiah(Number(value)), 'Pendapatan']}
                                labelFormatter={(label) => `Tanggal: ${label}`}
                                contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6' }}
                              />
                              <Area type="monotone" dataKey="pendapatan" stroke="#F97316" strokeWidth={2.5} fill="url(#colorPendapatan)" />
                            </AreaChart>
                          ) : (
                            <BarChart data={last7Days}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis dataKey="tanggal" fontSize={12} tickMargin={10} tickFormatter={formatTanggalShort} />
                              <YAxis fontSize={12} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                              <Tooltip
                                formatter={(value: any) => [formatRupiah(Number(value)), 'Pendapatan']}
                                labelFormatter={(label) => `Tanggal: ${label}`}
                                contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6' }}
                              />
                              <Bar dataKey="pendapatan" fill="#F97316" radius={[6, 6, 0, 0]} />
                            </BarChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>

                {/* Table - Daily Report */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none print:mt-8">
                  <div className="hidden print:block mb-4 font-bold text-lg text-gray-800">Rincian Pendapatan Harian:</div>
                  <div className="p-5 border-b border-gray-100 print:hidden">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <span><FontAwesomeIcon icon={faChartSimple} /></span> Ringkasan Pendapatan Harian
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                        <tr>
                          <th className="px-5 py-3">Tanggal</th>
                          <th className="px-5 py-3 text-center">Jumlah Transaksi</th>
                          <th className="px-5 py-3 text-right">Pendapatan</th>
                          <th className="px-5 py-3 text-right">Rata-rata</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {dailyReport.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                              Tidak ada data pendapatan.
                            </td>
                          </tr>
                        ) : (
                          dailyReport.map((item) => (
                            <tr key={item.tanggal} className="hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-4 font-medium text-gray-900">{formatTanggalShort(item.tanggal)} {new Date(item.tanggal).getFullYear()}</td>
                              <td className="px-5 py-4 text-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                  {item.jumlah} transaksi
                                </span>
                              </td>
                              <td className="px-5 py-4 text-right font-bold text-gray-900">{formatRupiah(item.pendapatan)}</td>
                              <td className="px-5 py-4 text-right text-gray-600">{formatRupiah(item.jumlah > 0 ? Math.round(item.pendapatan / item.jumlah) : 0)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      {dailyReport.length > 0 && (
                        <tfoot className="bg-orange-50 border-t-2 border-orange-200">
                          <tr>
                            <td className="px-5 py-3 font-bold text-gray-900">TOTAL</td>
                            <td className="px-5 py-3 text-center font-bold text-gray-900">{data.totalTransaksi}</td>
                            <td className="px-5 py-3 text-right font-extrabold text-brand-orange text-base">{formatRupiah(data.totalPendapatan)}</td>
                            <td className="px-5 py-3 text-right font-bold text-gray-700">{formatRupiah(data.rataRata)}</td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>
              </div>

              {/* Side Panel */}
              <div className="xl:col-span-1 space-y-6 print:hidden">
                {/* Breakdown Motor vs Mobil */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><span><FontAwesomeIcon icon={faCarSide} /></span> Breakdown Kendaraan</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><FontAwesomeIcon icon={faMotorcycle} /> Motor</span>
                        <span className="text-sm font-bold text-gray-900">{motorCount} transaksi</span>
                      </div>
                      <div className="text-right text-sm font-semibold text-green-600 mb-1">{formatRupiah(motorRevenue)}</div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${data.totalTransaksi > 0 ? (motorCount / data.totalTransaksi) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><FontAwesomeIcon icon={faCarSide} /> Mobil</span>
                        <span className="text-sm font-bold text-gray-900">{mobilCount} transaksi</span>
                      </div>
                      <div className="text-right text-sm font-semibold text-blue-600 mb-1">{formatRupiah(mobilRevenue)}</div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${data.totalTransaksi > 0 ? (mobilCount / data.totalTransaksi) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
                  <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                    <span><FontAwesomeIcon icon={faCircleInfo} /></span> Info Report
                  </h3>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li className="flex items-start gap-2"><span><FontAwesomeIcon icon={faCircleCheck} /></span> <span>Halaman ini khusus untuk Admin</span></li>
                    <li className="flex items-start gap-2"><span><FontAwesomeIcon icon={faCircleCheck} /></span> <span>Data diambil dari riwayat transaksi</span></li>
                    <li className="flex items-start gap-2"><span><FontAwesomeIcon icon={faCircleCheck} /></span> <span>Grafik menampilkan tren 7 hari terakhir</span></li>
                    <li className="flex items-start gap-2"><span><FontAwesomeIcon icon={faCircleCheck} /></span> <span>Gunakan filter untuk analisis spesifik</span></li>
                  </ul>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2"><span className="text-yellow-500 drop-shadow-sm"><FontAwesomeIcon icon={faBolt} /></span> Aksi Cepat</h3>
                  </div>
                  <div className="p-2 space-y-1">
                    <a href={parkingApi.exportCsvUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium w-full text-left transition-colors">
                      <span className="w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-600 text-lg"><FontAwesomeIcon icon={faFileArrowDown} /></span>
                      Export CSV
                    </a>
                    <button onClick={() => window.print()} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium w-full text-left transition-colors">
                      <span className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 text-lg"><FontAwesomeIcon icon={faPrint} /></span>
                      Print Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default FinancialReport;
