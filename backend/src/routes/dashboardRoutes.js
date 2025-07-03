const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dashboardController');
const { nanoid } = require('nanoid');
const prisma = require('../config/prisma');
const { PuppeteerCertificateGenerator } = require('../utils/puppeteer');
const fs = require('fs');
const path = require('path');
const { customAlphabet } = require('nanoid');

//protect

router.get('/', ctrl.getAll);
router.get('/:id_sertif', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id_sertif', ctrl.update);
router.delete('/:id_sertif', ctrl.delete);
router.put('/:id_sertif/generate', ctrl.generateSertifikat);
router.post('/bulk', ctrl.bulkUpload);
router.post('/bulk-delete', ctrl.bulkDelete);

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
  const { nama, aktivitas, batch } = req.body;
  if (!nama || !aktivitas || !batch) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }
  try {
    // Ambil kode aktivitas dari tabel Aktivitas
    const aktivitasObj = await prisma.aktivitas.findFirst({ where: { nama: aktivitas } });
    const kode = aktivitasObj ? aktivitasObj.kode : 'UNK';
    const now = new Date();
    const tahun = now.getFullYear().toString();

    // Hitung no_urut berdasarkan kombinasi kode, tahun, batch
    const count = await prisma.kodePerusahaan.count({
      where: {
        kode,
        batch,
        peserta: {
          tgl_submit: {
            gte: new Date(`${tahun}-01-01T00:00:00.000Z`),
            lte: new Date(`${tahun}-12-31T23:59:59.999Z`)
          }
        }
      }
    });
    const no_urut = count + 1;
    const id_sertif = generateIdWithDigits(2, 8);

    // 1. Create Peserta
    const peserta = await prisma.peserta.create({
      data: {
        id_sertif,
        nama,
        aktivitas,
        tgl_submit: now,
        konfirmasi_hadir: true
      }
    });

    // 2. Create KodePerusahaan
    const kodePerusahaan = await prisma.kodePerusahaan.create({
      data: { id_sertif, kode, batch, no_urut }
    });

    // 3. Generate kode perusahaan utuh
    const kode_perusahaan_utuh = `GRH/${kode}/${tahun}/${batch}/${String(no_urut).padStart(4, '0')}`;

    res.status(201).json({ message: 'Data berhasil disimpan', peserta, kodePerusahaan, kode_perusahaan_utuh });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menyimpan data', error: err.message });
  }
});

function generateIdWithDigits(minDigits = 2, length = 8) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const nanoidCustom = customAlphabet(alphabet, length);
  let id;
  do {
    id = nanoidCustom();
  } while ((id.match(/\d/g) || []).length < minDigits);
  return id;
}

module.exports = router; 