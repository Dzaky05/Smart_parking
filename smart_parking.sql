-- ============================================
-- Smart Parking — Database Schema
-- Jalankan script ini di MySQL sebelum deploy
-- ============================================

CREATE DATABASE IF NOT EXISTS smart_parking
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_general_ci;

USE smart_parking;

-- Tabel kendaraan yang sedang parkir (aktif)
CREATE TABLE IF NOT EXISTS kendaraan_aktif (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plat_nomor VARCHAR(20) NOT NULL UNIQUE,
    jenis VARCHAR(10) NOT NULL COMMENT 'Motor atau Mobil',
    waktu_masuk DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabel riwayat parkir (setelah kendaraan keluar)
CREATE TABLE IF NOT EXISTS riwayat_parkir (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plat_nomor VARCHAR(20) NOT NULL,
    jenis VARCHAR(10) NOT NULL,
    waktu_masuk DATETIME NOT NULL,
    waktu_keluar DATETIME NOT NULL,
    durasi_menit INT NOT NULL,
    tarif_per_jam INT NOT NULL,
    lama_jam INT NOT NULL,
    total_bayar INT NOT NULL
) ENGINE=InnoDB;

-- Tabel users (untuk login admin dan petugas)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL COMMENT 'ADMIN atau PETUGAS',
    nama VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- Default users (akan otomatis dibuat oleh DataSeeder saat aplikasi pertama kali dijalankan)
INSERT IGNORE INTO users (username, password, role, nama) VALUES
('admin@gmail.com', 'admin123', 'ADMIN', 'Administrator'),
('petugas@gmail.com', 'petugas123', 'PETUGAS', 'Petugas Parkir');
