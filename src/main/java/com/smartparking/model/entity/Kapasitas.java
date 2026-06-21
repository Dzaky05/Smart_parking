package com.smartparking.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Kapasitas {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String namaArea;
    private int jumlahKapasitas;

    public Kapasitas() {}

    public Kapasitas(String namaArea, int jumlahKapasitas) {
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
