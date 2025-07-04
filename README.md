# Sertifikat Generator

Aplikasi untuk mengelola dan generate sertifikat peserta dengan sistem kode perusahaan yang terintegrasi.

## Fitur Utama

- Upload data peserta via Excel
- Manajemen aktivitas dan kode aktivitas
- Generate sertifikat otomatis
- Sistem kode perusahaan terintegrasi

## Perbaikan Terbaru

### Perbaikan Kode Perusahaan untuk Aktivitas Baru

**Masalah:** Ketika upload Excel dengan aktivitas baru, kode perusahaan tidak tersimpan dengan benar karena aktivitas belum ada di database.

**Solusi:**
1. **Backend Changes:**
   - `ExcelService.js`: Menyimpan kode aktivitas sebagai string kosong untuk aktivitas baru
   - `aktivitasController.js`: Menambahkan fungsi untuk mengupdate kode perusahaan setelah aktivitas baru ditambahkan
   - `aktivitasRoutes.js`: Menambahkan endpoint `/update-kode-perusahaan`

2. **Frontend Changes:**
   - `Dashboard.jsx`: Menggunakan endpoint baru untuk mengupdate kode perusahaan
   - `TabelPeserta.jsx`: Menambahkan kolom untuk menampilkan kode perusahaan lengkap
   - `aktivitas.service.js`: Menambahkan fungsi `updateKodePerusahaan`

**Cara Kerja:**
1. Upload Excel dengan aktivitas baru → peserta disimpan dengan kode kosong
2. Sistem mendeteksi aktivitas baru dan meminta admin menambahkan kode
3. Admin menambahkan kode aktivitas → sistem otomatis mengupdate kode perusahaan untuk semua peserta terkait
4. Kode perusahaan lengkap ditampilkan di tabel dengan format: `GRH/KODE/TAHUN/BATCH/NOMOR`

## Instalasi

```bash
# Backend
cd backend
npm install
npm start

# Frontend  
cd frontend
npm install
npm run dev
```

## Struktur Database

- `Peserta`: Data peserta
- `KodePerusahaan`: Kode perusahaan dengan relasi ke peserta
- `Aktivitas`: Daftar aktivitas dan kode aktivitas
- `Batch`: Daftar batch
- `Admin`: Data admin
- `Settings`: Pengaturan aplikasi 