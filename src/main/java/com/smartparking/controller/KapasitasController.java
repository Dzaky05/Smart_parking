package com.smartparking.controller;

import com.smartparking.dto.request.KapasitasRequest;
import com.smartparking.dto.response.ApiResponse;
import com.smartparking.dto.response.KapasitasResponse;
import com.smartparking.service.KapasitasService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kapasitas")
public class KapasitasController {

    private final KapasitasService kapasitasService;

    public KapasitasController(KapasitasService kapasitasService) {
        this.kapasitasService = kapasitasService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<KapasitasResponse>>> getAllKapasitas() {
        List<KapasitasResponse> list = kapasitasService.getAllKapasitas();
        return ResponseEntity.ok(new ApiResponse<>("success", "Berhasil mengambil data kapasitas", list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<KapasitasResponse>> createKapasitas(@Valid @RequestBody KapasitasRequest request) {
        KapasitasResponse resp = kapasitasService.createKapasitas(request);
        return ResponseEntity.ok(new ApiResponse<>("success", "Berhasil menambahkan kapasitas", resp));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<KapasitasResponse>> updateKapasitas(@PathVariable Long id, @Valid @RequestBody KapasitasRequest request) {
        KapasitasResponse resp = kapasitasService.updateKapasitas(id, request);
        return ResponseEntity.ok(new ApiResponse<>("success", "Berhasil mengupdate kapasitas", resp));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteKapasitas(@PathVariable Long id) {
        kapasitasService.deleteKapasitas(id);
        return ResponseEntity.ok(new ApiResponse<>("success", "Berhasil menghapus kapasitas", null));
    }
}
