const express = require('express');
const multer = require('multer');
const path = require('path');
const { nanoid, customAlphabet } = require('nanoid');
const prisma = require('../config/prisma');
const router = express.Router();
const XLSX = require('xlsx');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads/signatures')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/signature', upload.single('signature'), (req, res) => {
  res.json({ path: req.file.path });
});

// Contoh handler upload Excel (sesuaikan dengan handler Anda)
router.post('/excel', async (req, res) => {
  try {
    // Ambil file buffer dari request
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', async () => {
      const buffer = Buffer.concat(chunks);
      // Parse Excel
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      // Mapping aktivitas ke kodeAktivitas
      const aktivitasMap = {
        'Try Out CPNS 2025': 'TO-CoA',
        'Seminar Digital Marketing': 'SDM',
        'Seminar Kewirausahaan': 'SKW',
        'Try Out UTBK 2025': 'TO-UTBK',
        'Webinar Teknologi AI': 'WTAI',
        'Workshop Design Thinking': 'WDT',
      };
      const kodePerusahaan = 'GRH';
      const tahun = new Date().getFullYear();

      for (const row of rows) {
        const noUrut = String(row.NoUrut).padStart(4, '0');
        const kodeAktivitas = aktivitasMap[row.Aktivitas] || 'UNK';
        const batch = row.Batch || 'BATCH';
        const companyCode = `${kodePerusahaan}/${kodeAktivitas}/${tahun}/${batch}/${noUrut}`;
        await prisma.dashboard.create({
          data: {
            id_sertif: generateIdWithDigits(2, 12),
            nama: row.Nama,
            aktivitas: row.Aktivitas,
            kode_perusahaan: companyCode,
            tgl_submit: new Date(),
            konfirmasi_hadir: true,
          }
        });
      }
      res.status(201).json({ message: 'Upload berhasil' });
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal upload Excel', error: err.message });
  }
});

function generateIdWithDigits(minDigits = 2, length = 12) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const nanoidCustom = customAlphabet(alphabet, length);
  let id;
  do {
    id = nanoidCustom();
  } while ((id.match(/\d/g) || []).length < minDigits);
  return id;
}

module.exports = router; 
//protect