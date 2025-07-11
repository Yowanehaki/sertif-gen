const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dashboardController');
const { nanoid } = require('nanoid');
const prisma = require('../config/prisma');
const generator = require('../utils/puppeteer');
const fs = require('fs');
const path = require('path');
const { customAlphabet } = require('nanoid');
const multer = require('multer');
const archiver = require('archiver');
const accessValidation = require('../middleware/admin/validationAccess');

// Multer setup untuk upload tanda tangan
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../../uploads/tandatangan');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `ttd_${Date.now()}${ext}`);
  }
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG files are allowed for signature!'), false);
    }
  }
});

// Endpoint submit form peserta (PUBLIC, tidak perlu token)
router.post('/submit', async (req, res) => {
  const { nama, email, no_telp, aktivitas, batch, verifikasi } = req.body;
  if (!nama || !email || !no_telp || !aktivitas || !batch) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }
  
  // Validasi format nomor telepon
  const phoneRegex = /^08[0-9]{8,11}$/;
  if (!phoneRegex.test(no_telp)) {
    return res.status(400).json({ 
      message: 'Format nomor telepon tidak valid. Gunakan format: 081234567890 (minimal 11 digit, maksimal 13 digit)' 
    });
  }
  
  try {
    // Ambil kode aktivitas dari tabel Aktivitas
    const aktivitasObj = await prisma.aktivitas.findFirst({ where: { nama: aktivitas } });
    const kode = aktivitasObj ? aktivitasObj.kode : 'UNK';
    const now = new Date();
    const tahun = now.getFullYear().toString();

    // Cari no_urut terkecil yang belum dipakai untuk kombinasi kode, batch, tahun
    const existing = await prisma.kodePerusahaan.findMany({
      where: { kode, batch, tahun: parseInt(tahun) },
      select: { no_urut: true }
    });
    const existingNoUrut = new Set(existing.map(e => e.no_urut));
    let no_urut = 1;
    while (existingNoUrut.has(no_urut)) no_urut++;
    const id_sertif = generateIdWithDigits(2, 8);

    // 1. Create Peserta
    const peserta = await prisma.peserta.create({
      data: {
        id_sertif,
        nama,
        email,
        no_telp,
        aktivitas,
        tgl_submit: now,
        verifikasi: false
      }
    });

    // 2. Create KodePerusahaan
    const kodePerusahaan = await prisma.kodePerusahaan.create({
      data: { id_sertif, kode, batch, tahun: parseInt(tahun), no_urut }
    });

    // 3. Generate kode perusahaan utuh
    const kode_perusahaan_utuh = `GRH/${kode}/${tahun}/${batch}/${String(no_urut).padStart(4, '0')}`;

    res.status(201).json({ message: 'Data berhasil disimpan', peserta, kodePerusahaan, kode_perusahaan_utuh });
  } catch (err) {
    console.error('Error submit peserta:', err);
    res.status(500).json({ message: 'Gagal menyimpan data', error: err.message });
  }
});

// Endpoint generate sertifikat (PDF) dan download langsung (PUBLIC)
router.post('/:id_sertif/generate', async (req, res) => {
  const { id_sertif } = req.params;
  try {
    const peserta = await prisma.peserta.findUnique({ where: { id_sertif } });
    if (!peserta) return res.status(404).json({ message: 'Peserta tidak ditemukan' });
    const kodePerusahaan = await prisma.kodePerusahaan.findUnique({ where: { id_sertif } });
    // Data untuk sertifikat
    const data = {
      participantName: peserta.nama,
      activity: peserta.aktivitas,
      dateIssued: peserta.tgl_terbit_sertif || peserta.tgl_submit,
      examinerName: peserta.nama_penguji || '',
      examinerPosition: peserta.jabatan_penguji || '',
      companyCode: kodePerusahaan ? `GRH/${kodePerusahaan.kode}/${new Date(peserta.tgl_submit).getFullYear()}/${kodePerusahaan.batch}/${String(kodePerusahaan.no_urut).padStart(4, '0')}` : '',
      serialNumber: peserta.id_sertif,
      signaturePath: peserta.tandatangan || '',
    };
    // Pastikan folder tmp ada
    const tmpDir = path.join(__dirname, '../../tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const tempPdfPath = path.join(tmpDir, `sertifikat-${id_sertif}.pdf`);
    const result = await generator.generateCertificatePDF(data, tempPdfPath);
    if (!result.success) {
      console.error('Generate PDF error:', result.error, data);
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
    console.error('Generate PDF error:', err);
    res.status(500).json({ message: 'Gagal generate sertifikat', error: err.message });
  }
});

// Endpoint bulk generate sertifikat (PDF & PNG) dan download ZIP (PUBLIC)
router.post('/bulk-generate', async (req, res) => {
  const { ids } = req.body; // array of id_sertif
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ message: 'IDs required' });
  try {
    const tmpDir = path.join(__dirname, '../../tmp/bulk');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const files = [];
    for (const id_sertif of ids) {
      const peserta = await prisma.peserta.findUnique({ where: { id_sertif } });
      if (!peserta) continue;
      const kodePerusahaan = await prisma.kodePerusahaan.findUnique({ where: { id_sertif } });
      const data = {
        participantName: peserta.nama,
        activity: peserta.aktivitas,
        dateIssued: peserta.tgl_terbit_sertif || peserta.tgl_submit,
        examinerName: peserta.nama_penguji || '',
        examinerPosition: peserta.jabatan_penguji || '',
        companyCode: kodePerusahaan ? `GRH/${kodePerusahaan.kode}/${new Date(peserta.tgl_submit).getFullYear()}/${kodePerusahaan.batch}/${String(kodePerusahaan.no_urut).padStart(4, '0')}` : '',
        serialNumber: peserta.id_sertif,
        signaturePath: peserta.tandatangan || '',
      };
      // PDF
      const pdfPath = path.join(tmpDir, `sertifikat-${id_sertif}.pdf`);
      const pdfResult = await generator.generateCertificatePDF(data, pdfPath);
      if (pdfResult.success) files.push({ path: pdfPath, name: `sertifikat-${id_sertif}.pdf` });
      // PNG
      const pngResult = await generator.generateCertificateImage(data);
      if (pngResult.success) files.push({ path: pngResult.outputPath, name: `sertifikat-${id_sertif}.png` });
    }
    // ZIP
    res.setHeader('Content-Disposition', 'attachment; filename=sertifikat-bulk.zip');
    res.setHeader('Content-Type', 'application/zip');
    const archive = archiver('zip');
    archive.pipe(res);
    for (const file of files) {
      archive.file(file.path, { name: file.name });
    }
    archive.finalize();
    archive.on('end', () => {
      // Hapus file temp setelah selesai
      for (const file of files) {
        fs.unlink(file.path, () => {});
      }
    });
  } catch (err) {
    console.error('Bulk generate error:', err);
    res.status(500).json({ message: 'Gagal bulk generate', error: err.message });
  }
});

// Endpoint generate sertifikat PNG dan download langsung (PUBLIC)
router.post('/:id_sertif/generate-png', async (req, res) => {
  const { id_sertif } = req.params;
  try {
    const peserta = await prisma.peserta.findUnique({ where: { id_sertif } });
    if (!peserta) return res.status(404).json({ message: 'Peserta tidak ditemukan' });
    const kodePerusahaan = await prisma.kodePerusahaan.findUnique({ where: { id_sertif } });
    // Data untuk sertifikat
    const data = {
      participantName: peserta.nama,
      activity: peserta.aktivitas,
      dateIssued: peserta.tgl_terbit_sertif || peserta.tgl_submit,
      examinerName: peserta.nama_penguji || '',
      examinerPosition: peserta.jabatan_penguji || '',
      companyCode: kodePerusahaan ? `GRH/${kodePerusahaan.kode}/${new Date(peserta.tgl_submit).getFullYear()}/${kodePerusahaan.batch}/${String(kodePerusahaan.no_urut).padStart(4, '0')}` : '',
      serialNumber: peserta.id_sertif,
      signaturePath: peserta.tandatangan || '',
    };
    // Pastikan folder tmp ada
    const tmpDir = path.join(__dirname, '../../tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    const pngResult = await generator.generateCertificateImage(data);
    if (!pngResult.success) {
      console.error('Generate PNG error:', pngResult.error, data);
      return res.status(500).json({ message: 'Gagal generate PNG', error: pngResult.error });
    }
    res.setHeader('Content-Disposition', `attachment; filename=sertifikat-${id_sertif}.png`);
    res.setHeader('Content-Type', 'image/png');
    const filestream = fs.createReadStream(pngResult.outputPath);
    filestream.pipe(res);
    filestream.on('end', () => {
      fs.unlink(pngResult.outputPath, () => {});
    });
  } catch (err) {
    console.error('Generate PNG error:', err);
    res.status(500).json({ message: 'Gagal generate PNG', error: err.message });
  }
});

// Endpoint untuk mendapatkan daftar tanda tangan yang tersimpan
router.get('/saved-signatures', async (req, res) => {
  try {
    const signaturesDir = path.join(__dirname, '../../uploads/signatures');
    if (!fs.existsSync(signaturesDir)) {
      return res.json({ signatures: [] });
    }
    const files = fs.readdirSync(signaturesDir);
    const signatures = files
      .filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file))
      .map(file => ({
        filename: file,
        path: `uploads/signatures/${file}`,
        url: `/uploads/signatures/${file}`,
        createdAt: fs.statSync(path.join(signaturesDir, file)).mtime
      }))
      .sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first
    res.json({ signatures });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil daftar tanda tangan', error: err.message });
  }
});

// Endpoint untuk menghapus tanda tangan yang tersimpan
router.delete('/saved-signatures/:filename', async (req, res) => {
  const { filename } = req.params;
  try {
    const filePath = path.join(__dirname, '../../uploads/signatures', filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File tidak ditemukan' });
    }
    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'Tanda tangan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus tanda tangan', error: err.message });
  }
});

// Protect semua route dashboard - hanya admin yang bisa akses
router.use(accessValidation);

router.get('/', ctrl.getAll);
router.get('/:id_sertif', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id_sertif', ctrl.update);
router.delete('/:id_sertif', ctrl.delete);
router.put('/:id_sertif/generate', ctrl.generateSertifikat);
router.post('/bulk', ctrl.bulkUpload);
router.post('/bulk-delete', ctrl.bulkDelete);

const kodePerusahaan = 'GRH';
const aktivitasMap = {
  'Try Out CPNS 2025': 'TO-CoA',
  'Seminar Digital Marketing': 'SDM',
  'Seminar Kewirausahaan': 'SKW',
  'Try Out UTBK 2025': 'TO-UTBK',
  'Webinar Teknologi AI': 'WTAI',
  'Workshop Design Thinking': 'WDT',
};

// Endpoint upload tanda tangan peserta
router.post('/:id_sertif/upload-tandatangan', upload.single('tandatangan'), async (req, res) => {
  const { id_sertif } = req.params;
  if (!req.file) return res.status(400).json({ message: 'File tidak ditemukan' });
  const filePath = path.relative(path.join(__dirname, '../../'), req.file.path); // simpan relative path
  try {
    await prisma.peserta.update({
      where: { id_sertif },
      data: { tandatangan: filePath }
    });
    res.json({ success: true, path: filePath });
  } catch (err) {
    res.status(500).json({ message: 'Gagal update tanda tangan', error: err.message });
  }
});

// Endpoint untuk menyimpan tanda tangan secara permanen
router.post('/save-signature', upload.single('signature'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File tidak ditemukan' });
  try {
    const signaturesDir = path.join(__dirname, '../../uploads/signatures');
    if (!fs.existsSync(signaturesDir)) fs.mkdirSync(signaturesDir, { recursive: true });
    let fileName = req.body.customName || `signature_${Date.now()}_${path.basename(req.file.originalname)}`;
    if (!fileName.endsWith('.png')) fileName += '.png';
    const newPath = path.join(signaturesDir, fileName);
    fs.renameSync(req.file.path, newPath);
    const relativePath = path.relative(path.join(__dirname, '../../'), newPath);
    res.json({ success: true, path: relativePath, filename: fileName, message: 'Tanda tangan berhasil disimpan' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menyimpan tanda tangan', error: err.message });
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

// Note: Auto-cleanup removed to preserve signatures permanently // Cek setiap 30 detik

module.exports = router; 