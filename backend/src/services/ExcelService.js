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
          const aktivitas = row[headerMapping.aktivitas];
          const batch = row[headerMapping.batch];
          return { nama, aktivitas, batch };
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
            // Hitung nomor urut untuk kombinasi aktivitas, batch, tahun
            const count = await tx.kodePerusahaan.count({
              where: {
                batch: p.batch,
                kode: kodeAktivitas,
                peserta: {
                  aktivitas: p.aktivitas,
                  tgl_submit: {
                    gte: new Date(`${tahun}-01-01T00:00:00.000Z`),
                    lte: new Date(`${tahun}-12-31T23:59:59.999Z`),
                  },
                },
              },
            });
            const no_urut = count + 1;
            // Insert peserta dan kode perusahaan
            const id_sertif = nanoid();
            const peserta = await tx.peserta.create({
              data: {
                id_sertif,
                nama: p.nama,
                aktivitas: p.aktivitas,
                tgl_submit: now,
                konfirmasi_hadir: true,
                kodePerusahaan: {
                  create: {
                    kode: kodeAktivitas,
                    batch: p.batch,
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