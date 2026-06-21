package com.smartparking.service;

import com.smartparking.dto.request.KapasitasRequest;
import com.smartparking.dto.response.KapasitasResponse;
import com.smartparking.model.entity.Kapasitas;
import com.smartparking.repository.KapasitasRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KapasitasServiceImpl implements KapasitasService {

    private final KapasitasRepository kapasitasRepository;

    public KapasitasServiceImpl(KapasitasRepository kapasitasRepository) {
        this.kapasitasRepository = kapasitasRepository;
    }

    @Override
    public List<KapasitasResponse> getAllKapasitas() {
        return kapasitasRepository.findAll().stream()
                .map(k -> new KapasitasResponse(k.getId(), k.getNamaArea(), k.getJumlahKapasitas()))
                .collect(Collectors.toList());
    }

    @Override
    public KapasitasResponse createKapasitas(KapasitasRequest request) {
        Kapasitas k = new Kapasitas(request.getNamaArea(), request.getJumlahKapasitas());
        k = kapasitasRepository.save(k);
        return new KapasitasResponse(k.getId(), k.getNamaArea(), k.getJumlahKapasitas());
    }

    @Override
    public KapasitasResponse updateKapasitas(Long id, KapasitasRequest request) {
        Kapasitas k = kapasitasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kapasitas tidak ditemukan"));
        k.setNamaArea(request.getNamaArea());
        k.setJumlahKapasitas(request.getJumlahKapasitas());
        k = kapasitasRepository.save(k);
        return new KapasitasResponse(k.getId(), k.getNamaArea(), k.getJumlahKapasitas());
    }

    @Override
    public void deleteKapasitas(Long id) {
        if (!kapasitasRepository.existsById(id)) {
            throw new RuntimeException("Kapasitas tidak ditemukan");
        }
        kapasitasRepository.deleteById(id);
    }

    @Override
    public Integer getTotalKapasitas() {
        Integer total = kapasitasRepository.getTotalKapasitas();
        return total != null ? total : 0;
    }
}
