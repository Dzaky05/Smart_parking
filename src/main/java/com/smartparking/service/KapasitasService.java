package com.smartparking.service;

import com.smartparking.dto.request.KapasitasRequest;
import com.smartparking.dto.response.KapasitasResponse;

import java.util.List;

public interface KapasitasService {
    List<KapasitasResponse> getAllKapasitas();
    KapasitasResponse createKapasitas(KapasitasRequest request);
    KapasitasResponse updateKapasitas(Long id, KapasitasRequest request);
    void deleteKapasitas(Long id);
    Integer getTotalKapasitas();
}
