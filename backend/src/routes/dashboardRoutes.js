const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dashboardController');
const { nanoid } = require('nanoid');
const prisma = require('../config/prisma');
const { PuppeteerCertificateGenerator } = require('../utils/puppeteer');
const fs = require('fs');
const path = require('path');

router.get('/', ctrl.getAll);
router.get('/:id_sertif', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id_sertif', ctrl.update);
router.delete('/:id_sertif', ctrl.delete);
router.put('/:id_sertif/generate', ctrl.generateSertifikat);
router.post('/bulk', ctrl.bulkUpload);

// Endpoint generate sertifikat (PDF) dan download langsung
router.post('/:id_sertif/generate', async (req, res) => {
  const { id_sertif } = req.params;
  try {
    const peserta = await prisma.dashboard.findUnique({ where: { id_sertif } });
    if (!peserta) return res.status(404).json({ message: 'Peserta tidak ditemukan' });

    // Data untuk sertifikat
    const data = {
      participantName: peserta.nama,
      activity: peserta.aktivitas,
      dateIssued: peserta.tgl_submit,
      examinerName: peserta.nama_penguji || '',
      examinerPosition: peserta.jabatan_penguji || '',
      companyCode: peserta.kode_perusahaan,
      serialNumber: peserta.id_sertif,
      signaturePath: peserta.tandatangan || '',
    };
    const generator = new PuppeteerCertificateGenerator();
    const tempPdfPath = path.join(__dirname, `../../tmp/sertifikat-${id_sertif}.pdf`);
    const result = await generator.generateCertificatePDF(data, tempPdfPath);
    if (!result.success) {
      return res.status(500).json({ message: 'Gagal generate sertifikat', error: result.error });
    }
    // Stream file ke client, lalu hapus file temp
    res.setHeader('Content-Disposition', `attachment; filename=sertifikat-${id_sertif}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    const filestream = fs.createReadStream(tempPdfPath);
    filestream.pipe(res);
    filestream.on('end', () => {
      fs.unlink(tempPdfPath, () => {});
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal generate sertifikat', error: err.message });
  }
});

const kodePerusahaan = 'GRH';
const aktivitasMap = {
  'Try Out CPNS 2025': 'TO-CoA',
  'Seminar Digital Marketing': 'SDM',
  'Seminar Kewirausahaan': 'SKW',
  'Try Out UTBK 2025': 'TO-UTBK',
  'Webinar Teknologi AI': 'WTAI',
  'Workshop Design Thinking': 'WDT',
};

// Endpoint submit form peserta
router.post('/submit', async (req, res) => {
  const { nama, aktivitas } = req.body;
  if (!nama || !aktivitas) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }
  try {
    const kodeAktivitas = aktivitasMap[aktivitas] || 'UNK';
    const now = new Date();
    const tahun = now.getFullYear();
    const batch = 'VIII'; // bisa diubah sesuai kebutuhan

    // Hitung nomor urut sertif untuk tahun+aktivitas
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

    const id_sertif = nanoid(8);
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