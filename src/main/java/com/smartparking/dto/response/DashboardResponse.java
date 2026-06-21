package com.smartparking.dto.response;

import java.util.List;

public class DashboardResponse {
    private int kendaraanAktif;
    private int jumlahMobil;
    private int jumlahMotor;
    private int kapasitasTersedia;
    private int totalKapasitas;
    private List<KendaraanAktifResponse> listAktif;

    public DashboardResponse() {}

    public int getKendaraanAktif() { return kendaraanAktif; }
    public void setKendaraanAktif(int kendaraanAktif) { this.kendaraanAktif = kendaraanAktif; }

    public int getJumlahMobil() { return jumlahMobil; }
    public void setJumlahMobil(int jumlahMobil) { this.jumlahMobil = jumlahMobil; }

    public int getJumlahMotor() { return jumlahMotor; }
    public void setJumlahMotor(int jumlahMotor) { this.jumlahMotor = jumlahMotor; }

    public int getKapasitasTersedia() { return kapasitasTersedia; }
    public void setKapasitasTersedia(int kapasitasTersedia) { this.kapasitasTersedia = kapasitasTersedia; }
    
    public int getTotalKapasitas() { return totalKapasitas; }
    public void setTotalKapasitas(int totalKapasitas) { this.totalKapasitas = totalKapasitas; }

    public List<KendaraanAktifResponse> getListAktif() { return listAktif; }
    public void setListAktif(List<KendaraanAktifResponse> listAktif) { this.listAktif = listAktif; }
}
