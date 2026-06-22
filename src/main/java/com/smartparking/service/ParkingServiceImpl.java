package com.smartparking.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.smartparking.dto.request.ParkingKeluarRequest;
import com.smartparking.dto.request.ParkingMasukRequest;
import com.smartparking.dto.response.DashboardResponse;
import com.smartparking.dto.response.KendaraanAktifResponse;
import com.smartparking.dto.response.RiwayatResponse;
import com.smartparking.dto.response.StrukResponse;
import com.smartparking.model.domain.Kendaraan;
import com.smartparking.model.domain.Mobil;
import com.smartparking.model.domain.Motor;
import com.smartparking.model.entity.KendaraanAktif;
import com.smartparking.model.entity.RiwayatParkir;
import com.smartparking.repository.KendaraanAktifRepository;
import com.smartparking.repository.RiwayatParkirRepository;

@Service
public class ParkingServiceImpl implements ParkingService {

    private final KendaraanAktifRepository aktifRepo;
    private final RiwayatParkirRepository riwayatRepo;
    private final com.smartparking.repository.KapasitasRepository kapasitasRepo;

    public ParkingServiceImpl(KendaraanAktifRepository aktifRepo, RiwayatParkirRepository riwayatRepo, com.smartparking.repository.KapasitasRepository kapasitasRepo) {
        this.aktifRepo = aktifRepo;
        this.riwayatRepo = riwayatRepo;
        this.kapasitasRepo = kapasitasRepo;
    }

    // Factory method: buat Motor/Mobil berdasarkan jenis
    private Kendaraan createKendaraan(String jenis, String plat, LocalDateTime masuk) {
        if ("Motor".equalsIgnoreCase(jenis)) {
            return new Motor(plat, masuk);
        } else if ("Mobil".equalsIgnoreCase(jenis)) {
            return new Mobil(plat, masuk);
        } else {
            throw new IllegalArgumentException("Jenis tidak valid");
        }
    }

    @Override
    public DashboardResponse getDashboard() {
        List<KendaraanAktif> listAll = aktifRepo.findAll();
        int motor = 0;
        int mobil = 0;
        List<KendaraanAktifResponse> listResponse = new ArrayList<>();

        for (KendaraanAktif k : listAll) {
            if ("Motor".equalsIgnoreCase(k.getJenis())) motor++;
            if ("Mobil".equalsIgnoreCase(k.getJenis())) mobil++;

            KendaraanAktifResponse resp = new KendaraanAktifResponse();
            resp.setId(k.getId());
            resp.setPlatNomor(k.getPlatNomor());
            resp.setJenis(k.getJenis());
            resp.setWaktuMasuk(k.getWaktuMasuk().toString());
            resp.setDurasiMenit(k.getDurasiMenit());
            listResponse.add(resp);
        }

        Integer dbCapacity = kapasitasRepo.getTotalKapasitas();
        int totalKapasitas = dbCapacity != null ? dbCapacity : 0;

        DashboardResponse dash = new DashboardResponse();
        dash.setKendaraanAktif(listAll.size());
        dash.setJumlahMobil(mobil);
        dash.setJumlahMotor(motor);
        dash.setKapasitasTersedia(totalKapasitas - listAll.size());
        dash.setTotalKapasitas(totalKapasitas);
        dash.setListAktif(listResponse);
        return dash;
    }

    @Override
    public KendaraanAktifResponse parkingMasuk(ParkingMasukRequest req) {
        if (aktifRepo.existsByPlatNomor(req.getPlatNomor())) {
            throw new IllegalArgumentException("Kendaraan dengan plat " + req.getPlatNomor() + " sudah ada di dalam.");
        }
        Integer dbCapacity = kapasitasRepo.getTotalKapasitas();
        int totalKapasitas = dbCapacity != null ? dbCapacity : 0;

        if (aktifRepo.count() >= totalKapasitas) {
            throw new RuntimeException("Kapasitas parkir penuh");
        }

        KendaraanAktif k = new KendaraanAktif(req.getPlatNomor(), req.getJenis(), LocalDateTime.now());
        k = aktifRepo.save(k);

        KendaraanAktifResponse resp = new KendaraanAktifResponse();
        resp.setId(k.getId());
        resp.setPlatNomor(k.getPlatNomor());
        resp.setJenis(k.getJenis());
        resp.setWaktuMasuk(k.getWaktuMasuk().toString());
        resp.setDurasiMenit(0);
        return resp;
    }

    @Override
    public List<KendaraanAktifResponse> getKendaraanAktif() {
        return aktifRepo.findAll().stream().map(k -> {
            KendaraanAktifResponse resp = new KendaraanAktifResponse();
            resp.setId(k.getId());
            resp.setPlatNomor(k.getPlatNomor());
            resp.setJenis(k.getJenis());
            resp.setWaktuMasuk(k.getWaktuMasuk().toString());
            resp.setDurasiMenit(k.getDurasiMenit());
            return resp;
        }).collect(Collectors.toList());
    }

    @Override
    public StrukResponse parkingKeluar(ParkingKeluarRequest req) {
        KendaraanAktif data = aktifRepo.findById(req.getId())
                .orElseThrow(() -> new RuntimeException("Kendaraan tidak ditemukan"));

        Kendaraan k = createKendaraan(data.getJenis(), data.getPlatNomor(), data.getWaktuMasuk());
        LocalDateTime keluar = LocalDateTime.now();
        int durasi = k.hitungDurasiMenit(keluar); 
        int lamaJam = k.hitungLamaJam(durasi);      
        int total = k.hitungTarif(durasi);         

        RiwayatParkir r = new RiwayatParkir();
        r.setPlatNomor(data.getPlatNomor());
        r.setJenis(data.getJenis());
        r.setWaktuMasuk(data.getWaktuMasuk());
        r.setWaktuKeluar(keluar);
        r.setDurasiMenit(durasi);
        r.setTarifPerJam(k.getTarifPerJam());
        r.setLamaJam(lamaJam);
        r.setTotalBayar(total);
        riwayatRepo.save(r);
        aktifRepo.deleteById(req.getId());

        StrukResponse struk = new StrukResponse();
        struk.setPlatNomor(data.getPlatNomor());
        struk.setJenis(data.getJenis());
        struk.setWaktuMasuk(data.getWaktuMasuk().toString());
        struk.setWaktuKeluar(keluar.toString());
        struk.setDurasiMenit(durasi);
        struk.setTarifPerJam(k.getTarifPerJam());
        struk.setLamaJam(lamaJam);
        struk.setTotalBayar(total);
        return struk;
    }

    @Override
    public RiwayatResponse getRiwayat(String tanggal, String jenis, String platNomor) {
        List<RiwayatParkir> all = riwayatRepo.findAll();
        
        // Apply filters
        List<RiwayatParkir> filtered = all.stream()
            .filter(r -> {
                // Filter by tanggal (match date part of waktuKeluar)
                if (tanggal != null && !tanggal.isEmpty()) {
                    String tgl = r.getWaktuKeluar().toLocalDate().toString(); // yyyy-MM-dd
                    if (!tgl.equals(tanggal)) return false;
                }
                // Filter by jenis
                if (jenis != null && !jenis.isEmpty()) {
                    if (!r.getJenis().equalsIgnoreCase(jenis)) return false;
                }
                // Filter by platNomor (partial match, case-insensitive)
                if (platNomor != null && !platNomor.isEmpty()) {
                    if (!r.getPlatNomor().toUpperCase().contains(platNomor.toUpperCase())) return false;
                }
                return true;
            })
            .collect(java.util.stream.Collectors.toList());

        long totalTransaksi = filtered.size();
        long totalPendapatan = filtered.stream().mapToInt(RiwayatParkir::getTotalBayar).sum();
        double rataRata = totalTransaksi > 0 ? (double) totalPendapatan / totalTransaksi : 0;

        // Build chart7Hari from all data (not filtered) for context
        java.util.Map<String, long[]> dayMap = new java.util.LinkedHashMap<>();
        for (RiwayatParkir r : all) {
            String tgl = r.getWaktuKeluar().toLocalDate().toString();
            dayMap.computeIfAbsent(tgl, k -> new long[]{0, 0});
            dayMap.get(tgl)[0]++;
            dayMap.get(tgl)[1] += r.getTotalBayar();
        }
        List<java.util.Map<String, Object>> chart7Hari = new ArrayList<>();
        List<String> sortedDays = new ArrayList<>(dayMap.keySet());
        java.util.Collections.sort(sortedDays);
        int startIdx = Math.max(0, sortedDays.size() - 7);
        for (int i = startIdx; i < sortedDays.size(); i++) {
            String d = sortedDays.get(i);
            java.util.Map<String, Object> entry = new java.util.HashMap<>();
            entry.put("tanggal", d);
            entry.put("jumlah", dayMap.get(d)[0]);
            entry.put("pendapatan", dayMap.get(d)[1]);
            chart7Hari.add(entry);
        }

        RiwayatResponse resp = new RiwayatResponse();
        resp.setTotalTransaksi(totalTransaksi);
        resp.setTotalPendapatan(totalPendapatan);
        resp.setRataRata(rataRata);
        resp.setTransaksi(filtered);
        resp.setChart7Hari(chart7Hari);
        return resp;
    }

    @Override
    public void deleteRiwayat(Long id, String role) {
        if (role == null || !role.equalsIgnoreCase("ADMIN")) {
            throw new IllegalArgumentException("Hanya admin yang dapat menghapus data riwayat");
        }
        if (!riwayatRepo.existsById(id)) {
            throw new RuntimeException("Data riwayat tidak ditemukan");
        }
        riwayatRepo.deleteById(id);
    }

    @Override
    public byte[] exportCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append("ID,Plat Nomor,Jenis,Masuk,Keluar,Durasi (Menit),Lama (Jam),Total Bayar\n");
        for (RiwayatParkir r : riwayatRepo.findAll()) {
            sb.append(r.getId()).append(",")
              .append(r.getPlatNomor()).append(",")
              .append(r.getJenis()).append(",")
              .append(r.getWaktuMasuk()).append(",")
              .append(r.getWaktuKeluar()).append(",")
              .append(r.getDurasiMenit()).append(",")
              .append(r.getLamaJam()).append(",")
              .append(r.getTotalBayar()).append("\n");
        }
        return sb.toString().getBytes();
    }
}
