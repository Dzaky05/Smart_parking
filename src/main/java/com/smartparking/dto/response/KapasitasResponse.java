package com.smartparking.dto.response;

public class KapasitasResponse {
    
    private Long id;
    private String namaArea;
    private int jumlahKapasitas;

    public KapasitasResponse() {}

    public KapasitasResponse(Long id, String namaArea, int jumlahKapasitas) {
        this.id = id;
        this.namaArea = namaArea;
        this.jumlahKapasitas = jumlahKapasitas;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNamaArea() {
        return namaArea;
    }

    public void setNamaArea(String namaArea) {
        this.namaArea = namaArea;
    }

    public int getJumlahKapasitas() {
        return jumlahKapasitas;
    }

    public void setJumlahKapasitas(int jumlahKapasitas) {
        this.jumlahKapasitas = jumlahKapasitas;
    }
}
