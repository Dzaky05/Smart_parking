# Smart Parking System

<p align="center">
  <img src="Fastag_animation.svg" width="300" alt="Smart Parking System" />
</p>

Aplikasi web full-stack untuk mengelola sistem parkir pintar yang memantau kapasitas real-time, mencatat kendaraan masuk/keluar, dan menghasilkan laporan keuangan otomatis.

**Tugas Besar PBO — Telkom University**

---

## Konfigurasi Aplikasi

### Persyaratan Sistem
| Komponen | Versi |
|----------|-------|
| Java | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| npm | 9+ |

### Database (MySQL)

Aplikasi menggunakan **MySQL** untuk penyimpanan data. Database akan dibuat otomatis saat aplikasi dijalankan.

Konfigurasi koneksi ada di [src/main/resources/application.properties](src/main/resources/application.properties):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/smart_parking?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
```

> Skema tabel dibuat otomatis saat backend pertama kali dijalankan (`ddl-auto: update`).

### Menjalankan Aplikasi

**Backend (Spring Boot — port 8080):**
```bash
mvn spring-boot:run
```

atau menggunakan Maven wrapper:
```bash
./mvnw spring-boot:run
```

**Frontend (Vite React — port 5173):**
```bash
cd smart-parking-fe
npm install
npm run dev
```

Akses aplikasi di: `http://localhost:5173`

---

## Akun yang Tersedia

### Role: USER

| Username | Password | Keterangan |
|----------|----------|------------|
| `user1` | `password123` | Akun utama |
| `testuser` | *(gunakan Register)* | Akun tes tambahan |

> Sistem autentikasi menggunakan JWT token untuk keamanan session.

Untuk membuat akun baru, gunakan halaman **Login** dengan opsi registrasi, kemudian isi:
- Username
- Password
- Email (opsional)

---

## Fitur Utama

| Fitur | Endpoint Frontend | Deskripsi |
|-------|-------------------|-----------|
| Login | `/login` | Autentikasi pengguna |
| Dashboard | `/` | Ringkasan kapasitas parkir dan statistik |
| Parkir Masuk | `/parking-in` | Pencatatan kendaraan masuk dengan nomor plat |
| Parkir Keluar | `/parking-out` | Pencatatan kendaraan keluar dan perhitungan tarif |
| Riwayat Parkir | `/history` | Rekap semua transaksi parkir |
| Kapasitas | `/capacity` | Monitoring kapasitas parkir real-time |
| Laporan Keuangan | `/financial-report` | Analisis pendapatan dan statistik parkir |

---

## Arsitektur

```
TubesPBOSemester4/
├── src/
│   └── main/
│       ├── java/com/smartparking/
│       │   ├── controller/          # REST endpoints
│       │   ├── model/               # Entity + Domain logic
│       │   │   ├── domain/          # Business objects
│       │   │   └── entity/          # JPA entities
│       │   ├── service/             # Business logic layer
│       │   ├── repository/          # Spring Data JPA
│       │   ├── dto/                 # Data Transfer Objects
│       │   │   ├── request/         # Input DTO
│       │   │   └── response/        # Output DTO
│       │   ├── exception/           # Custom exceptions
│       │   ├── config/              # Configuration classes
│       │   └── SmartParkingApplication.java
│       └── resources/
│           └── application.properties
├── smart-parking-fe/               # React + TypeScript + Vite
│   └── src/
│       ├── pages/                  # Halaman-halaman utama
│       ├── components/             # Komponen reusable
│       │   └── smart-parking/      # Komponen domain spesifik
│       ├── api/                    # Axios API calls
│       ├── context/                # React Context (AuthContext)
│       ├── types/                  # TypeScript type definitions
│       ├── utils/                  # Utility functions
│       └── assets/                 # Static assets
├── smart_parking.sql               # Database schema (backup)
├── pom.xml                         # Maven dependencies
└── mvnw.cmd                        # Maven wrapper
```

---

## Konsep OOP yang Diimplementasikan

### Modul 3 — Enkapsulasi
- **`Kendaraan` entity**: Private fields dengan getter/setter
- **`Parkir` entity**: Private fields untuk data parkir dengan aksesor yang terkontrol
- **`User` entity**: Password dan data sensitif dienkapsulasi

### Modul 6 — Interface & Polimorfisme
- **`ParkingService` interface**: Contract untuk operasi parkir
- **`ParkingServiceImpl`**: Implementasi konkret dari service interface
- **`KapasitasService` interface**: Contract untuk manajemen kapasitas

### Modul 7 — Lambda & Stream API
- **`ParkingController.getHistory()`**: Menggunakan Stream API untuk filter dan mapping data
- **`KapasitasController`**: Stream untuk agregasi data kapasitas
- **DTO mapping**: Lambda expressions di service layer untuk transformasi entity ke DTO

### Modul 9 — Exception Handling
- **`GlobalExceptionHandler`**: Centralized exception handling dengan `@ControllerAdvice`
- **Custom exceptions**: `ParkingException`, `KapasitasException`
- **Try-catch-finally**: Di method `calculateTariff()`, `processParkingOut()`

### Modul 10 — Polymorphism
- Multiple implementations dari service interfaces
- Dependency injection menggunakan `@Service` dan `@Autowired` annotations
- Runtime polymorphism di business logic layer

---

## Dependency & Tools

### Backend
- **Spring Boot 3.2.3**: Web framework
- **Spring Data JPA**: ORM dan database abstraction
- **MySQL Connector**: Database driver
- **Validation API**: Input validation

### Frontend
- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool dan dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Three.js & React Three Fiber**: 3D rendering (untuk komponen visual)
- **Recharts**: Data visualization untuk laporan
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

---

## Instalasi & Setup Detail

### Langkah 1: Setup Database
```bash
# Pastikan MySQL running
# Database akan dibuat otomatis pada startup
```

### Langkah 2: Setup Backend
```bash
# Dari root folder
mvn clean install
mvn spring-boot:run
```

Backend akan start di `http://localhost:8080`

### Langkah 3: Setup Frontend
```bash
cd smart-parking-fe
npm install
npm run dev
```

Frontend akan start di `http://localhost:5173`

### Langkah 4: Akses Aplikasi
Buka browser dan kunjungi: `http://localhost:5173`

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register user baru

### Parking Operations
- `GET /api/parking` - Get semua parkir records
- `POST /api/parking/in` - Pencatatan parkir masuk
- `POST /api/parking/out` - Pencatatan parkir keluar

### Capacity Management
- `GET /api/kapasitas` - Get kapasitas current
- `PUT /api/kapasitas` - Update kapasitas maksimal

### Reports
- `GET /api/reports/financial` - Laporan keuangan
- `GET /api/reports/history` - Riwayat lengkap

---

## File Penting

| File | Deskripsi |
|------|-----------|
| [SmartParkingApplication.java](src/main/java/com/smartparking/SmartParkingApplication.java) | Entry point aplikasi |
| [ParkingController.java](src/main/java/com/smartparking/controller/ParkingController.java) | REST endpoints parkir |
| [ParkingService.java](src/main/java/com/smartparking/service/ParkingService.java) | Business logic parkir |
| [CorsConfig.java](src/main/java/com/smartparking/config/CorsConfig.java) | CORS configuration |
| [GlobalExceptionHandler.java](src/main/java/com/smartparking/exception/GlobalExceptionHandler.java) | Error handling |
| [Dashboard.tsx](smart-parking-fe/src/pages/Dashboard.tsx) | Dashboard halaman |
| [AuthContext.tsx](smart-parking-fe/src/context/AuthContext.tsx) | Auth state management |

---

## Troubleshooting

### Backend error: "Port 8080 already in use"
```bash
# Ubah port di application.properties
server.port=8081
```

### Frontend: API call failed
Pastikan:
1. Backend sudah running di port 8080
2. CORS configuration sudah di-setup dengan benar
3. Check browser console untuk error details

### Database connection error
```bash
# Verify MySQL connection
# Username: root
# Password: (sesuaikan di application.properties)
# Database: smart_parking (akan dibuat otomatis)
```

### Node modules error
```bash
cd smart-parking-fe
rm -rf node_modules package-lock.json
npm install
```

---

## Build & Deployment

### Build Frontend
```bash
cd smart-parking-fe
npm run build
# Output di dist/ folder
```

### Build Backend JAR
```bash
mvn clean package
# Output di target/smartparking-api-*.jar
```

### Run JAR file
```bash
java -jar target/smartparking-api-0.0.1-SNAPSHOT.jar
```

---

## Kontribusi & Testing

### Run Tests (Backend)
```bash
mvn test
```

### Lint Frontend
```bash
cd smart-parking-fe
npm run lint
```

---

## Tim Pengembang

Developed as part of **Object-Oriented Programming (PBO)** course assignment at **Telkom University**.

---

## License

This project is part of an academic assignment and is provided as-is for educational purposes.

---

**Last Updated**: June 2026  
**Status**: Active Development
