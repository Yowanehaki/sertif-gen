const express = require('express');
const multer = require('multer');
const path = require('path');
const { nanoid } = require('nanoid');
const prisma = require('../config/prisma');
const router = express.Router();

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
  // ... kode parsing file Excel ...
  // Misal rows = hasil parsing Excel
  for (const row of rows) {
    await prisma.dashboard.create({
      data: {
        id_sertif: nanoid(12),
        nama: row.Nama,
        aktivitas: row.Aktivitas,
        kode_perusahaan: row['Company Code'],
        tgl_submit: new Date(),
        konfirmasi_hadir: true,
      }
    });
  }
  res.status(201).json({ message: 'Upload berhasil' });
});

module.exports = router; 