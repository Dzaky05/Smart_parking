export type JenisKendaraan = 'Motor' | 'Mobil';

export interface KendaraanAktif {
  id: number;
  platNomor: string;
  jenis: JenisKendaraan;
  waktuMasuk: string;
  durasiMenit: number;
}

export interface DashboardData {
  kendaraanAktif: number;
  jumlahMobil: number;
  jumlahMotor: number;
  kapasitasTersedia: number;
  totalKapasitas: number;
  listAktif: KendaraanAktif[];
}

export interface StrukData {
  platNomor: string;
  jenis: JenisKendaraan;
  waktuMasuk: string;
  waktuKeluar: string;
  durasiMenit: number;
  tarifPerJam: number;
  lamaJam: number;
  totalBayar: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface RiwayatItem {
  id: number;
  platNomor: string;
  jenis: JenisKendaraan;
  waktuMasuk: string;
  waktuKeluar: string;
  durasiMenit: number;
  totalBayar: number;
}

export interface ChartItem {
  tanggal: string;
  jumlah: number;
  pendapatan: number;
}

export interface ParkingMasukPayload {
  platNomor: string;
  jenis: JenisKendaraan;
}

export interface ParkingKeluarPayload {
  id: number;
}

export interface RiwayatResponse {
  totalTransaksi: number;
  totalPendapatan: number;
  rataRata: number;
  transaksi: RiwayatItem[];
  chart7Hari: ChartItem[];
}

export type KendaraanAktifResponse = KendaraanAktif;

