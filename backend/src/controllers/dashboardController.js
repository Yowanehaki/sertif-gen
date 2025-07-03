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
  const data = await prisma.peserta.findUnique({ where: { id_sertif } });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
};

exports.create = async (req, res) => {
  const { nama, aktivitas, tgl_submit, kode, batch, konfirmasi_hadir } = req.body;
  const id_sertif = generateIdWithDigits(2, 8);
  const tahun = new Date(tgl_submit).getFullYear().toString();

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

  // 1. Create Peserta
  const peserta = await prisma.peserta.create({
    data: { id_sertif, nama, aktivitas, tgl_submit: new Date(tgl_submit), konfirmasi_hadir }
  });

  // 2. Create KodePerusahaan
  const kodePerusahaan = await prisma.kodePerusahaan.create({
    data: { id_sertif, kode, batch, no_urut }
  });

  // 3. Generate kode perusahaan utuh
  const kode_perusahaan_utuh = `GRH/${kode}/${tahun}/${batch}/${String(no_urut).padStart(4, '0')}`;

  // 4. Gabungkan hasil jika perlu
  res.json({ ...peserta, kodePerusahaan, kode_perusahaan_utuh });
};

exports.update = async (req, res) => {
  const { id_sertif } = req.params;
  const { nama, aktivitas, konfirmasi_hadir, batch } = req.body;
  try {
    // Update peserta
    const peserta = await prisma.peserta.update({
      where: { id_sertif },
      data: {
        nama,
        aktivitas,
        ...(typeof konfirmasi_hadir !== 'undefined' ? { konfirmasi_hadir: Boolean(konfirmasi_hadir) } : {})
      }
    });
    // Update batch & no_urut jika batch atau aktivitas diubah
    if (batch || aktivitas) {
      // Ambil kode aktivitas dari tabel Aktivitas
      const aktivitasObj = await prisma.aktivitas.findFirst({ where: { nama: aktivitas || peserta.aktivitas } });
      const kode = aktivitasObj ? aktivitasObj.kode : 'UNK';
      const tahun = peserta.tgl_submit.getFullYear().toString();
      // Hitung no_urut baru untuk kombinasi kode, batch, tahun
      const count = await prisma.kodePerusahaan.count({
        where: {
          kode,
          batch: batch || peserta.kodePerusahaan.batch,
          peserta: {
            tgl_submit: {
              gte: new Date(`${tahun}-01-01T00:00:00.000Z`),
              lte: new Date(`${tahun}-12-31T23:59:59.999Z`)
            }
          }
        }
      });
      const no_urut = count + 1;
      await prisma.kodePerusahaan.update({
        where: { id_sertif },
        data: {
          batch: batch || peserta.kodePerusahaan.batch,
          kode,
          no_urut
        }
      });
    }
    res.json(peserta);
  } catch (error) {
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
  const { nama_penguji, jabatan_penguji, tgl_terbit_sertif, tandatangan } = req.body;
  const data = await prisma.peserta.update({
    where: { id_sertif },
    data: {
      nama_penguji,
      jabatan_penguji,
      tgl_terbit_sertif: tgl_terbit_sertif ? new Date(tgl_terbit_sertif) : null,
      tandatangan
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