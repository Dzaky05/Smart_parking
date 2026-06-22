import api from './axios';
import type { 
  ApiResponse, 
  DashboardData, 
  KendaraanAktif, 
  KendaraanAktifResponse, 
  ParkingKeluarPayload, 
  ParkingMasukPayload, 
  RiwayatResponse, 
  StrukData 
} from '../types/parking';

export const parkingApi = {
  getDashboard: async () => {
    const response = await api.get<ApiResponse<DashboardData>>('/dashboard');
    return response.data;
  },

  getKendaraanAktif: async () => {
    const response = await api.get<ApiResponse<KendaraanAktif[]>>('/parking/aktif');
    return response.data;
  },

  postMasuk: async (payload: ParkingMasukPayload) => {
    const response = await api.post<ApiResponse<KendaraanAktifResponse>>('/parking/masuk', payload);
    return response.data;
  },

  postKeluar: async (payload: ParkingKeluarPayload) => {
    const response = await api.post<ApiResponse<StrukData>>('/parking/keluar', payload);
    return response.data;
  },

  getRiwayat: async (tanggal?: string, jenis?: string, platNomor?: string) => {
    const params = new URLSearchParams();
    if (tanggal) params.append('tanggal', tanggal);
    if (jenis) params.append('jenis', jenis);
    if (platNomor) params.append('platNomor', platNomor);
    
    const response = await api.get<ApiResponse<RiwayatResponse>>(`/riwayat?${params.toString()}`);
    return response.data;
  },

  deleteRiwayat: async (id: number, role: string) => {
    const response = await api.delete<ApiResponse<null>>(`/riwayat/${id}`, {
      headers: { 'X-User-Role': role },
    });
    return response.data;
  },

  exportCsvUrl: 'http://localhost:8080/api/riwayat/export-csv'
};
