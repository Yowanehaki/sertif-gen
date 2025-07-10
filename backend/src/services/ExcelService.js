const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8);


class ExcelService {
  static parseExcelFile(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (jsonData.length < 2) throw new Error('File Excel harus ada header dan data');
      const headers = jsonData[0];
      const dataRows = jsonData.slice(1);
      // Mapping header
      const headerMapping = {};
      headers.forEach((header, idx) => {
        if (!header) return;
        const h = header.toString().trim().toLowerCase();
        if (h === 'nama') headerMapping.nama = idx;
        if (h === 'email') headerMapping.email = idx;
        if (h === 'notelp' || h === 'no telp' || h === 'no_telp') headerMapping.no_telp = idx;
        if (h === 'aktivitas') headerMapping.aktivitas = idx;
        if (h === 'batch') headerMapping.batch = idx;
      });
      // Validasi kolom wajib
      ['nama', 'aktivitas', 'batch'].forEach(field => {
        if (headerMapping[field] === undefined) throw new Error(`Kolom ${field} tidak ditemukan`);
      });
      // Proses data
      return dataRows
        .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
        .map(row => {
          const nama = row[headerMapping.nama];
          const email = row[headerMapping.email] || '-';
          let no_telp = row[headerMapping.no_telp] || '-';
          
          // Normalisasi nomor telepon untuk berbagai format input
          if (no_telp !== '-') {
            no_telp = no_telp.toString().replace(/[^0-9]/g, '');
            
            // Normalisasi berdasarkan format:
            // 1. Jika dimulai dengan "62" (62813...), hapus "62" dan tambah "0"
            if (no_telp.startsWith('62')) {
              no_telp = '0' + no_telp.substring(2);
            }
            // 2. Jika dimulai dengan "8" (813...), tambah "0" di depan
            else if (no_telp.startsWith('8')) {
              no_telp = '0' + no_telp;
            }
            // 3. Jika sudah dimulai dengan "08", biarkan
            // 4. Format lain akan ditolak oleh validasi regex
            
            // Validasi format nomor telepon (harus 08xxx dengan total 11-13 digit)
            const phoneRegex = /^08[0-9]{8,11}$/;
            if (!phoneRegex.test(no_telp)) {
              throw new Error(`Format nomor telepon tidak valid untuk ${nama}: ${row[headerMapping.no_telp]}. Gunakan format: 081234567890 atau 8134567890 atau 628134567890`);
            }
          }
          
          const aktivitas = row[headerMapping.aktivitas];
          const batch = row[headerMapping.batch];
          return { nama, email, no_telp, aktivitas, batch };
        });
    } catch (error) {
      throw new Error(`Error parsing Excel file: ${error.message}`);
    }
  }

  static async saveParticipantsToDatabase(participants) {
    try {
      const saved = [];
      const aktivitasBaruSet = new Set();
      const batchBaruSet = new Set();
      const now = new Date();
      // Ambil semua aktivitas yang sudah terdaftar
      const aktivitasDB = await prisma.aktivitas.findMany();
      const aktivitasTerdaftar = new Set(aktivitasDB.map(a => a.nama));
      // Ambil semua batch yang sudah terdaftar
      const batchDB = await prisma.batch.findMany();
      const batchTerdaftar = new Set(batchDB.map(b => b.nama));
      // Buat batch baru di database jika ada batchBaru
      for (const batchNama of participants.map(p => p.batch)) {
        if (!batchTerdaftar.has(batchNama)) {
          await prisma.batch.upsert({
            where: { nama: batchNama },
            update: {},
            create: { nama: batchNama, aktif: false },
          });
          batchTerdaftar.add(batchNama);
        }
      }
      for (const p of participants) {
        // Deteksi aktivitas baru
        if (!aktivitasTerdaftar.has(p.aktivitas)) {
          aktivitasBaruSet.add(p.aktivitas);
        }
        // Deteksi batch baru
        if (!batchTerdaftar.has(p.batch)) {
          batchBaruSet.add(p.batch);
        }
        // Atomic insert peserta + kode perusahaan
        try {
          const peserta = await prisma.$transaction(async (tx) => {
            // Ambil tahun dari tanggal submit/upload
            const tahun = now.getFullYear();
            // Ambil kode aktivitas dari tabel Aktivitas
            const aktivitasObj = await tx.aktivitas.findUnique({ where: { nama: p.aktivitas } });
            const kodeAktivitas = aktivitasObj ? aktivitasObj.kode : '';
            // Cari no_urut terkecil yang belum dipakai untuk kombinasi kode, batch, tahun
            const existing = await tx.kodePerusahaan.findMany({
              where: { kode: kodeAktivitas, batch: p.batch, tahun: parseInt(tahun) },
              select: { no_urut: true }
            });
            const existingNoUrut = new Set(existing.map(e => e.no_urut));
            let no_urut = 1;
            while (existingNoUrut.has(no_urut)) no_urut++;
            // Insert peserta dan kode perusahaan
            const id_sertif = nanoid();
            const peserta = await tx.peserta.create({
              data: {
                id_sertif,
                nama: p.nama,
                email: p.email,
                no_telp: p.no_telp,
                aktivitas: p.aktivitas,
                tgl_submit: now,
                verifikasi: false,
                kodePerusahaan: {
                  create: {
                    kode: kodeAktivitas,
                    batch: p.batch,
                    tahun: parseInt(tahun),
                    no_urut
                  }
                }
              },
              include: { kodePerusahaan: true }
            });
            return peserta;
          });
          saved.push(peserta);
        } catch (error) {
          if (error.code === 'P2002') {
            // Duplikat kode perusahaan, skip peserta ini
            continue;
          } else {
            throw error;
          }
        }
      }
      return {
        peserta: saved,
        aktivitasBaru: Array.from(aktivitasBaruSet),
        batchBaru: Array.from(batchBaruSet),
      };
    } catch (error) {
      throw new Error(`Error saving to database: ${error.message}`);
    }
  }
}

module.exports = ExcelService; 