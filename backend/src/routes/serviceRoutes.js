const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const prisma = require('../config/prisma');

const kodePerusahaan = 'GRH';
const aktivitasMap = {
  'Try Out CPNS 2025': 'TO-CoA',
  'Seminar Digital Marketing': 'SDM',
  'Seminar Kewirausahaan': 'SKW',
  'Try Out UTBK 2025': 'TO-UTBK',
  'Webinar Teknologi AI': 'WTAI',
  'Workshop Design Thinking': 'WDT',
};

// Endpoint untuk memasukkan data peserta
router.post('/peserta', async (req, res) => {
  const { nama, aktivitas } = req.body;
  if (!nama || !aktivitas) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }
  try {
    const kodeAktivitas = aktivitasMap[aktivitas] || 'UNK';
    const now = new Date();
    const tahun = now.getFullYear();
    const batch = 'VIII';
    const count = await prisma.dashboard.count({
      where: {
        aktivitas,
        tgl_submit: {
          gte: new Date(`${tahun}-01-01T00:00:00.000Z`),
          lte: new Date(`${tahun}-12-31T23:59:59.999Z`)
        }
      }
    });
    const noUrut = String(count + 1).padStart(4, '0');
    const companyCode = `${kodePerusahaan}/${kodeAktivitas}/${tahun}/${batch}/${noUrut}`;
    const id_sertif = nanoid(12);
    const peserta = await prisma.dashboard.create({
      data: {
        id_sertif,
        nama,
        aktivitas,
        kode_perusahaan: companyCode,
        tgl_submit: now,
        konfirmasi_hadir: true,
      }
    });
    res.status(201).json({ message: 'Data berhasil disimpan', peserta });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menyimpan data', error: err.message });
  }
});

module.exports = router; 

// protect