import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenToSquare, faTrash, faSquareParking, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';

interface Kapasitas {
  id: number;
  namaArea: string;
  jumlahKapasitas: number;
}

const KapasitasPage: React.FC = () => {
  const [data, setData] = useState<Kapasitas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ namaArea: '', jumlahKapasitas: 0 });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/kapasitas');
      setData(res.data.data || []);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mengambil data kapasitas');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (k?: Kapasitas) => {
    if (k) {
      setEditId(k.id);
      setForm({ namaArea: k.namaArea, jumlahKapasitas: k.jumlahKapasitas });
    } else {
      setEditId(null);
      setForm({ namaArea: '', jumlahKapasitas: 0 });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm({ namaArea: '', jumlahKapasitas: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitLoading(true);
      if (editId) {
        await api.put(`/kapasitas/${editId}`, form);
      } else {
        await api.post('/kapasitas', form);
      }
      handleCloseModal();
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan kapasitas');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin ingin menghapus data kapasitas ini?')) {
      try {
        await api.delete(`/kapasitas/${id}`);
        fetchData();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Gagal menghapus kapasitas');
      }
    }
  };

  const totalKapasitas = data.reduce((sum, item) => sum + item.jumlahKapasitas, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Navbar title="Manajemen Kapasitas" showBack={true} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <StatCard 
            label="Total Kapasitas Slot" 
            value={loading ? '...' : totalKapasitas} 
            icon={<FontAwesomeIcon icon={faSquareParking} />} 
            subLabel="Gabungan seluruh area"
            color="purple"
          />
          <StatCard 
            label="Jumlah Area Parkir" 
            value={loading ? '...' : data.length} 
            icon={<FontAwesomeIcon icon={faMapLocationDot} />} 
            subLabel="Area terdaftar aktif"
            color="orange"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span><FontAwesomeIcon icon={faSquareParking} /></span> Daftar Area Parkir
              </h2>
              <p className="text-sm text-gray-500 mt-1">Kelola ketersediaan kapasitas slot di setiap area</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={() => handleOpenModal()}
                className="bg-brand-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <FontAwesomeIcon icon={faPlus} /> Tambah Area
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-purple-50 text-purple-800 font-medium border-b border-purple-100">
                <tr>
                  <th className="px-5 py-3">No</th>
                  <th className="px-5 py-3">Nama Area</th>
                  <th className="px-5 py-3">Jumlah Kapasitas</th>
                  <th className="px-5 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-gray-500">Loading data...</td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-gray-500">Belum ada data kapasitas terdaftar. Silakan tambah area baru.</td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4 text-gray-600 font-medium">{index + 1}</td>
                      <td className="px-5 py-4 font-bold text-gray-900">{item.namaArea}</td>
                      <td className="px-5 py-4 text-gray-700">
                        <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md font-semibold">
                          {item.jumlahKapasitas} Slot
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleOpenModal(item)}
                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                            title="Hapus"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 italic flex justify-between items-center">
            <div>Data area dan kapasitas digunakan untuk memvalidasi kendaraan masuk.</div>
          </div>
        </div>

        {/* Modal form */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FontAwesomeIcon icon={editId ? faPenToSquare : faPlus} className={editId ? 'text-blue-500' : 'text-brand-orange'} />
                  {editId ? 'Edit Area Kapasitas' : 'Tambah Area Baru'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 text-xl font-medium">✕</button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-5">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nama Area *</label>
                  <input 
                    type="text" 
                    value={form.namaArea}
                    onChange={(e) => setForm({...form, namaArea: e.target.value})}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:ring-0 focus:border-brand-orange outline-none transition-colors"
                    placeholder="Contoh: Lantai 1 / Area Reguler"
                    required
                  />
                </div>
                
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Jumlah Kapasitas Slot *</label>
                  <input 
                    type="number" 
                    min="1"
                    value={form.jumlahKapasitas || ''}
                    onChange={(e) => setForm({...form, jumlahKapasitas: parseInt(e.target.value) || 0})}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2.5 focus:ring-0 focus:border-brand-orange outline-none transition-colors"
                    placeholder="Contoh: 50"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-bold transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitLoading}
                    className="flex-[2] bg-brand-orange hover:bg-orange-600 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-70 shadow-sm"
                  >
                    {submitLoading ? 'Menyimpan...' : 'Simpan Data'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default KapasitasPage;
