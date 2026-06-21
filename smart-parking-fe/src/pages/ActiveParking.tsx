import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import VehicleBadge from '../components/VehicleBadge';
import { parkingApi } from '../api/parking';
import type { DashboardData } from '../types/parking';
import { formatDurasi, formatWaktu } from '../utils/format';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide, faMotorcycle, faCar, faStopwatch, faTriangleExclamation, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

const ActiveParking: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const [filterPlat, setFilterPlat] = useState('');

  const fetchDashboard = async () => {
    try {
      const result = await parkingApi.getDashboard();
      setData(result.data);
      setLastUpdate(new Date());
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data kendaraan aktif');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredData = data?.listAktif.filter(item => 
    item.platNomor.toLowerCase().includes(filterPlat.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Navbar title="Kendaraan Aktif" showBack={true} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200">
            <FontAwesomeIcon icon={faTriangleExclamation} /> {error}
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard 
              label="Kendaraan Aktif" 
              value={data.kendaraanAktif} 
              icon={<FontAwesomeIcon icon={faCarSide} />} 
              subLabel={`${data.totalKapasitas > 0 ? ((data.kendaraanAktif / data.totalKapasitas) * 100).toFixed(0) : 0}% terisi`}
              progress={data.totalKapasitas > 0 ? (data.kendaraanAktif / data.totalKapasitas) * 100 : 0}
              color="teal"
            />
            <StatCard 
              label="Mobil" 
              value={data.jumlahMobil} 
              icon={<FontAwesomeIcon icon={faCar} />} 
              subLabel={`${data.totalKapasitas > 0 ? ((data.jumlahMobil / data.totalKapasitas) * 100).toFixed(0) : 0}% dari kapasitas`}
              progress={data.totalKapasitas > 0 ? (data.jumlahMobil / data.totalKapasitas) * 100 : 0}
              color="blue"
            />
            <StatCard 
              label="Motor" 
              value={data.jumlahMotor} 
              icon={<FontAwesomeIcon icon={faMotorcycle} />} 
              subLabel={`${data.totalKapasitas > 0 ? ((data.jumlahMotor / data.totalKapasitas) * 100).toFixed(0) : 0}% dari kapasitas`}
              progress={data.totalKapasitas > 0 ? (data.jumlahMotor / data.totalKapasitas) * 100 : 0}
              color="pink"
            />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span><FontAwesomeIcon icon={faCarSide} /></span> Daftar Kendaraan Sedang Parkir
              </h2>
              <p className="text-sm text-gray-500 mt-1">Menampilkan seluruh kendaraan yang belum checkout</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Cari plat nomor..."
                value={filterPlat}
                onChange={(e) => setFilterPlat(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none uppercase w-full sm:w-64"
              />
              <span className="bg-orange-100 text-brand-orange px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap flex items-center">
                Total: {filteredData.length}
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-teal-50 text-teal-800 font-medium border-b border-teal-100">
                <tr>
                  <th className="px-5 py-3">Plat Nomor</th>
                  <th className="px-5 py-3">Jenis</th>
                  <th className="px-5 py-3">Waktu Masuk</th>
                  <th className="px-5 py-3">Durasi Parkir</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && !data ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                      Loading data...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                      Tidak ada kendaraan di area parkir saat ini.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 font-bold text-gray-900">{item.platNomor}</td>
                      <td className="px-5 py-4"><VehicleBadge jenis={item.jenis} /></td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900">{formatWaktu(item.waktuMasuk).split(' ')[1]}</div>
                        <div className="text-xs text-gray-500">{formatWaktu(item.waktuMasuk).split(' ')[0]}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-700">
                        <span className="inline-block mr-1"><FontAwesomeIcon icon={faStopwatch} /></span> {formatDurasi(item.durasiMenit)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span> Parkir Aktif
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 italic flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span><FontAwesomeIcon icon={faArrowsRotate} /></span> Durasi diperbarui otomatis setiap 30 detik
            </div>
            <div>
              Update terakhir: {formatWaktu(lastUpdate.toISOString()).split(' ')[1]}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActiveParking;
