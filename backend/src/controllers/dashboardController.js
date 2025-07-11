const prisma = require('../config/prisma');
const { nanoid, customAlphabet } = require('nanoid');

// Fungsi untuk generate id_sertif: 8 karakter, huruf kecil & angka, minimal 2 angka
function generateIdWithDigits(minDigits = 2, length = 8) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const nanoidCustom = customAlphabet(alphabet, length);
  let id;
  do {
    id = nanoidCustom();
  } while ((id.match(/\d/g) || []).length < minDigits);
  return id;
}

exports.getAll = async (req, res) => {
  const { nama, aktivitas, tgl_submit } = req.query;
  const where = {};
  if (nama) where.nama = { contains: nama };
  if (aktivitas) where.aktivitas = aktivitas;
  if (tgl_submit) where.tgl_submit = new Date(tgl_submit);
  const data = await prisma.peserta.findMany({
    where,
    orderBy: { tgl_submit: 'desc' },
    include: { kodePerusahaan: true }
  });
  res.json(data);
};

exports.getById = async (req, res) => {
  const { id_sertif } = req.params;
  const data = await prisma.peserta.findUnique({ where: { id_sertif }, include: { kodePerusahaan: true } });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
};

exports.create = async (req, res) => {
  const { nama, email, no_telp, aktivitas, tgl_submit, kode, batch, verifikasi } = req.body;
  
  // Validasi nomor telepon
  if (no_telp && no_telp !== '-') {
    const phoneRegex = /^08[0-9]{8,11}$/;
    if (!phoneRegex.test(no_telp)) {
      return res.status(400).json({ 
        error: 'Format nomor telepon tidak valid', 
        message: 'Gunakan format: 081234567890 (minimal 11 digit, maksimal 13 digit)' 
      });
    }
  }
  
  const id_sertif = generateIdWithDigits(2, 8);
  const tahun = new Date(tgl_submit || Date.now()).getFullYear().toString();
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Cari no_urut terkecil yang belum dipakai untuk kombinasi kode, batch, tahun
      const existing = await tx.kodePerusahaan.findMany({
        where: { kode, batch, tahun: parseInt(tahun) },
        select: { no_urut: true }
      });
      const existingNoUrut = new Set(existing.map(e => e.no_urut));
      let no_urut = 1;
      while (existingNoUrut.has(no_urut)) no_urut++;
      // 1. Create Peserta
      const peserta = await tx.peserta.create({
        data: { id_sertif, nama, email, no_telp, aktivitas, tgl_submit: new Date(tgl_submit || Date.now()), verifikasi }
      });
      // 2. Create KodePerusahaan
      const kodePerusahaan = await tx.kodePerusahaan.create({
        data: { id_sertif, kode, batch, tahun: parseInt(tahun), no_urut }
      });
      // 3. Generate kode perusahaan utuh
      const kode_perusahaan_utuh = `GRH/${kode}/${tahun}/${batch}/${String(no_urut).padStart(4, '0')}`;
      return { ...peserta, kodePerusahaan, kode_perusahaan_utuh };
    });
    res.json(result);
  } catch (error) {
    if (error.code === 'P2002') {
      // Unique constraint failed
      return res.status(400).json({ error: 'Kode perusahaan sudah digunakan. Silakan coba lagi.' });
    }
    res.status(500).json({ error: 'Gagal menyimpan data', message: error.message });
  }
};

exports.update = async (req, res) => {
  const { id_sertif } = req.params;
  const { nama, email, no_telp, aktivitas, verifikasi, batch, nama_penguji, jabatan_penguji, tgl_terbit_sertif, tandatangan } = req.body;
  
  // Normalisasi nomor telepon jika ada
  let normalizedNoTelp = no_telp;
  if (no_telp && no_telp !== '-') {
    normalizedNoTelp = no_telp.toString().replace(/[^0-9]/g, '');
    
    // Normalisasi berdasarkan format:
    // 1. Jika dimulai dengan "62" (62813...), hapus "62" dan tambah "0"
    if (normalizedNoTelp.startsWith('62')) {
      normalizedNoTelp = '0' + normalizedNoTelp.substring(2);
    }
    // 2. Jika dimulai dengan "8" (813...), tambah "0" di depan
    else if (normalizedNoTelp.startsWith('8')) {
      normalizedNoTelp = '0' + normalizedNoTelp;
    }
    
    // Validasi format nomor telepon (harus 08xxx dengan total 11-13 digit)
    const phoneRegex = /^08[0-9]{8,11}$/;
    if (!phoneRegex.test(normalizedNoTelp)) {
      return res.status(400).json({ 
        error: 'Format nomor telepon tidak valid', 
        message: 'Gunakan format: 081234567890, 8134567890, atau 628134567890' 
      });
    }
  }
  
  try {
    // Update peserta
    const peserta = await prisma.peserta.update({
      where: { id_sertif },
      data: {
        ...(typeof nama !== 'undefined' ? { nama } : {}),
        ...(typeof email !== 'undefined' ? { email } : {}),
        ...(typeof no_telp !== 'undefined' ? { no_telp: normalizedNoTelp } : {}),
        ...(typeof aktivitas !== 'undefined' ? { aktivitas } : {}),
        ...(typeof verifikasi !== 'undefined' ? { verifikasi: Boolean(verifikasi) } : {}),
        ...(typeof nama_penguji !== 'undefined' ? { nama_penguji } : {}),
        ...(typeof jabatan_penguji !== 'undefined' ? { jabatan_penguji } : {}),
        ...(typeof tgl_terbit_sertif !== 'undefined' ? { tgl_terbit_sertif: tgl_terbit_sertif ? new Date(tgl_terbit_sertif) : null } : {}),
        ...(typeof tandatangan !== 'undefined' ? { tandatangan } : {}),
      },
      include: { kodePerusahaan: true }
    });
    
    // Update batch & no_urut jika batch atau aktivitas diubah
    if (batch || aktivitas) {
      try {
      // Ambil kode aktivitas dari tabel Aktivitas
      const aktivitasObj = await prisma.aktivitas.findFirst({ where: { nama: aktivitas || peserta.aktivitas } });
      const kode = aktivitasObj ? aktivitasObj.kode : 'UNK';
      const tahun = peserta.tgl_submit.getFullYear().toString();
        
        // Cari no_urut terkecil yang belum dipakai untuk kombinasi kode, batch, tahun
        const existing = await prisma.kodePerusahaan.findMany({
        where: {
          kode,
          batch: batch || peserta.kodePerusahaan.batch,
            tahun: parseInt(tahun),
            id_sertif: { not: id_sertif } // Exclude current record
          },
          select: { no_urut: true }
      });
        const existingNoUrut = new Set(existing.map(e => e.no_urut));
        let no_urut = 1;
        while (existingNoUrut.has(no_urut)) no_urut++;
        
      await prisma.kodePerusahaan.update({
        where: { id_sertif },
        data: {
          batch: batch || peserta.kodePerusahaan.batch,
          kode,
            tahun: parseInt(tahun),
          no_urut
        }
      });
      } catch (error) {
        console.error('Error updating kodePerusahaan:', error);
        // Continue without updating kodePerusahaan if there's an error
      }
    }
    res.json(peserta);
  } catch (error) {
    console.error('Error updating peserta:', error);
    res.status(500).json({ error: 'Gagal update data', message: error.message });
  }
};

exports.delete = async (req, res) => {
  const { id_sertif } = req.params;
  try {
    // Hapus kodePerusahaan dulu
    await prisma.kodePerusahaan.deleteMany({ where: { id_sertif } });
    await prisma.peserta.delete({ where: { id_sertif } });
    res.json({ success: true, message: 'Peserta berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus data', message: error.message });
  }
};

exports.generateSertifikat = async (req, res) => {
  const { id_sertif } = req.params;
  const { nama_penguji, jabatan_penguji, tgl_terbit_sertif, tandatangan, verifikasi } = req.body;
  const data = await prisma.peserta.update({
    where: { id_sertif },
    data: {
      nama_penguji,
      jabatan_penguji,
      tgl_terbit_sertif: tgl_terbit_sertif ? new Date(tgl_terbit_sertif) : null,
      tandatangan,
      verifikasi: verifikasi !== undefined ? Boolean(verifikasi) : undefined
    }
  });
  res.json(data);
};

exports.bulkUpload = async (req, res) => {
  // Dummy: implementasi parsing excel bisa ditambah
  res.json({ success: true, message: 'Bulk upload belum diimplementasi.' });
};

exports.bulkDelete = async (req, res) => {
  const { ids } = req.body;
  try {
    // Hapus kodePerusahaan dulu
    await prisma.kodePerusahaan.deleteMany({ where: { id_sertif: { in: ids } } });
    await prisma.peserta.deleteMany({ where: { id_sertif: { in: ids } } });
    res.json({ success: true, message: `${ids.length} peserta berhasil dihapus` });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus data', message: error.message });
  }
}; 