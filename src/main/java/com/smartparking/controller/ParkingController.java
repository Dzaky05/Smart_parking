package com.smartparking.controller;

import com.smartparking.dto.request.ParkingKeluarRequest;
import com.smartparking.dto.request.ParkingMasukRequest;
import com.smartparking.dto.response.ApiResponse;
import com.smartparking.dto.response.DashboardResponse;
import com.smartparking.dto.response.KendaraanAktifResponse;
import com.smartparking.dto.response.RiwayatResponse;
import com.smartparking.dto.response.StrukResponse;
import com.smartparking.service.ParkingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ParkingController {

    private final ParkingService parkingService;

    public ParkingController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        DashboardResponse dash = parkingService.getDashboard();
        return ResponseEntity.ok(new ApiResponse<>("success", "Data dashboard berhasil diambil", dash));
    }

    @PostMapping("/parking/masuk")
    public ResponseEntity<ApiResponse<KendaraanAktifResponse>> parkingMasuk(@Valid @RequestBody ParkingMasukRequest req) {
        KendaraanAktifResponse resp = parkingService.parkingMasuk(req);
        return new ResponseEntity<>(new ApiResponse<>("success", "Kendaraan berhasil masuk", resp), HttpStatus.CREATED);
    }

    @GetMapping("/parking/aktif")
    public ResponseEntity<ApiResponse<List<KendaraanAktifResponse>>> getKendaraanAktif() {
        List<KendaraanAktifResponse> list = parkingService.getKendaraanAktif();
        return ResponseEntity.ok(new ApiResponse<>("success", "Data kendaraan aktif berhasil diambil", list));
    }

    @PostMapping("/parking/keluar")
    public ResponseEntity<ApiResponse<StrukResponse>> parkingKeluar(@Valid @RequestBody ParkingKeluarRequest req) {
        StrukResponse struk = parkingService.parkingKeluar(req);
        return ResponseEntity.ok(new ApiResponse<>("success", "Kendaraan berhasil keluar", struk));
    }

    @GetMapping("/riwayat")
    public ResponseEntity<ApiResponse<RiwayatResponse>> getRiwayat(
            @RequestParam(required = false) String tanggal,
            @RequestParam(required = false) String jenis,
            @RequestParam(required = false) String platNomor) {
        RiwayatResponse resp = parkingService.getRiwayat(tanggal, jenis, platNomor);
        return ResponseEntity.ok(new ApiResponse<>("success", "Data riwayat berhasil diambil", resp));
    }

    @GetMapping("/riwayat/export-excel")
    public ResponseEntity<byte[]> exportExcel() {
        byte[] excel = parkingService.exportExcel();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "riwayat_parkir.xlsx");
        return new ResponseEntity<>(excel, headers, HttpStatus.OK);
    }

    @DeleteMapping("/riwayat/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRiwayat(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role) {
        parkingService.deleteRiwayat(id, role);
        return ResponseEntity.ok(new ApiResponse<>("success", "Data riwayat berhasil dihapus", null));
    }
}
