package com.smartparking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public class KapasitasRequest {
    
    @NotBlank(message = "Nama area tidak boleh kosong")
    private String namaArea;
    
    @NotNull(message = "Jumlah kapasitas tidak boleh kosong")
    @Min(value = 1, message = "Kapasitas minimal 1")
    private Integer jumlahKapasitas;

    public KapasitasRequest() {}

    public String getNamaArea() {
        return namaArea;
    }

    public void setNamaArea(String namaArea) {
        this.namaArea = namaArea;
    }

    public Integer getJumlahKapasitas() {
        return jumlahKapasitas;
    }

    public void setJumlahKapasitas(Integer jumlahKapasitas) {
        this.jumlahKapasitas = jumlahKapasitas;
    }
}
