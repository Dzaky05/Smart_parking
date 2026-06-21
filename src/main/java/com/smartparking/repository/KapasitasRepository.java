package com.smartparking.repository;

import com.smartparking.model.entity.Kapasitas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface KapasitasRepository extends JpaRepository<Kapasitas, Long> {
    
    @Query("SELECT SUM(k.jumlahKapasitas) FROM Kapasitas k")
    Integer getTotalKapasitas();
}
