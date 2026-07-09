import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

import { parkingApi } from '../api/parking';
import type { JenisKendaraan } from '../types/parking';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarSide, faMotorcycle, faChartSimple, faTriangleExclamation, faArrowsRotate, faCircleInfo, faCircleCheck, faBolt, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

const ParkingIn: React.FC = () => {
  const navigate = useNavigate();
  const [platNomor, setPlatNomor] = useState('');
  const [jenis, setJenis] = useState<JenisKendaraan>('Motor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platNomor.trim()) { 
      setError('Masukkan plat nomor kendaraan (contoh: B 1234 XYZ)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await parkingApi.postMasuk({ platNomor: platNomor.trim().toUpperCase(), jenis });
      setSuccessToast(true);
      setTimeout(() => {
        setSuccessToast(false);
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memproses parkir masuk');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlatNomor('');
    setJenis('Motor');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      <Navbar title="Parkir Masuk" showBack={true} />

      {successToast && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <span className="text-xl"><FontAwesomeIcon icon={faCircleCheck} /></span>
            <span className="font-medium">Kendaraan berhasil masuk!</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-orange-500 to-orange-400 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span><FontAwesomeIcon icon={faCarSide} /></span> Form Input Kendaraan
                </h2>
                <p className="text-orange-100 mt-1 text-sm">Isi data kendaraan dengan lengkap</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {error && (
                  <div className="bg-red-600 text-white p-3 rounded-lg mb-6 shadow-sm text-sm flex items-center gap-2">
                    <span className="relative flex items-center justify-center">
                      <span className="absolute w-1 h-2 bg-black mt-0.5 z-0 rounded-sm"></span>
                      <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-500 text-base relative z-10" />
                    </span> 
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-brand-orange font-bold mb-2"><FontAwesomeIcon icon={faCarSide} /> Plat Nomor Kendaraan *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400"><FontAwesomeIcon icon={faCarSide} /></span>
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 rounded-lg focus:border-brand-orange focus:ring-0 outline-none text-lg font-bold uppercase transition-colors"
                      placeholder="CONTOH: B 1234 ABC"
                      value={platNomor}
                      onChange={(e) => setPlatNomor(e.target.value.toUpperCase())}
                    />
                  </div>
                  {!platNomor && <p className="text-red-500 text-xs mt-1.5 hidden">⚠ Masukkan plat nomor kendaraan</p>}
                </div>

                <div className="mb-8">
                  <label className="block text-brand-orange font-bold mb-3"><FontAwesomeIcon icon={faCarSide} /> Jenis Kendaraan *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => setJenis('Motor')}
                      className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center text-center transition-all ${
                        jenis === 'Motor' 
                          ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-500/20' 
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <div className={`text-4xl mb-2 ${jenis === 'Motor' ? 'text-pink-500' : 'text-pink-300'}`}><FontAwesomeIcon icon={faMotorcycle} /></div>
                      <div className={`font-bold text-lg ${jenis === 'Motor' ? 'text-pink-700' : 'text-gray-700'}`}>Motor</div>
                      <div className="text-xs text-gray-500 mt-1 hidden sm:block">Sepeda motor, skuter, dll</div>
                    </div>
                    
                    <div 
                      onClick={() => setJenis('Mobil')}
                      className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center text-center transition-all ${
                        jenis === 'Mobil' 
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className={`text-4xl mb-2 ${jenis === 'Mobil' ? 'text-blue-500' : 'text-blue-300'}`}><FontAwesomeIcon icon={faCarSide} /></div>
                      <div className={`font-bold text-lg ${jenis === 'Mobil' ? 'text-blue-700' : 'text-gray-700'}`}>Mobil</div>
                      <div className="text-xs text-gray-500 mt-1 hidden sm:block">Mobil penumpang, SUV, MPV</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-brand-orange hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <><span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span> Loading...</>
                    ) : (
                      <><span><FontAwesomeIcon icon={faFloppyDisk} /></span> Simpan Data Masuk</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={loading}
                    className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span><FontAwesomeIcon icon={faArrowsRotate} /></span> <span className="hidden sm:inline">Reset Form</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Side Panel Area */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
              <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                <span><FontAwesomeIcon icon={faCircleInfo} /></span> Informasi Parkir Masuk
              </h3>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li className="flex items-start gap-2"><span><FontAwesomeIcon icon={faCircleCheck} /></span> <span>Pastikan plat nomor terbaca dengan jelas</span></li>
                <li className="flex items-start gap-2"><span><FontAwesomeIcon icon={faCircleCheck} /></span> <span>Pilih jenis kendaraan sesuai kategori</span></li>
                <li className="flex items-start gap-2"><span><FontAwesomeIcon icon={faCircleCheck} /></span> <span>Waktu masuk akan tercatat otomatis</span></li>
                <li className="flex items-start gap-2 text-red-600 font-medium mt-3 border-t border-yellow-200/50 pt-2">
                  <span><FontAwesomeIcon icon={faTriangleExclamation} /></span> <span>Kendaraan yang belum keluar tidak bisa masuk lagi</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2"><span className="text-yellow-500 drop-shadow-sm"><FontAwesomeIcon icon={faBolt} /></span> Aksi Cepat</h3>
               </div>
               <div className="p-2">
                 <Link to="/" className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium">
                    <span className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-brand-orange"><FontAwesomeIcon icon={faChartSimple} /></span>
                    Lihat Dashboard
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParkingIn;
