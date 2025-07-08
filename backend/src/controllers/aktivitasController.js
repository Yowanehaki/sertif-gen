const prisma = require('../config/prisma');

exports.getAll = async (req, res) => {
  const data = await prisma.aktivitas.findMany({ orderBy: { nama: 'asc' } });
  res.json(data);
};

exports.create = async (req, res) => {
  const { nama, kode } = req.body;
  // Cek duplikat nama
  const existsNama = await prisma.aktivitas.findFirst({ where: { nama } });
  if (existsNama) return res.status(400).json({ error: 'Aktivitas sudah ada' });
  // Cek duplikat kode
  const existsKode = await prisma.aktivitas.findFirst({ where: { kode } });
  if (existsKode) return res.status(400).json({ error: 'Kode aktivitas sudah digunakan' });
  // Buat aktivitas baru
  await prisma.aktivitas.create({ data: { nama, kode, aktif: false } });
  // Update kode perusahaan untuk peserta yang sudah ada dengan aktivitas ini tapi belum punya kode
  await prisma.kodePerusahaan.updateMany({
    where: {
      kode: '', // Kode kosong
      peserta: {
        aktivitas: nama
      }
    },
    data: {
      kode: kode
    }
  });
  res.json({ success: true });
};

exports.update = async (req, res) => {
  const { id, nama, kode, aktif } = req.body;
  // Ambil aktivitas lama untuk update kode perusahaan
  const aktivitasLama = await prisma.aktivitas.findUnique({ where: { id } });
  // Cek duplikat kode (kecuali untuk aktivitas yang sedang diupdate)
  if (kode) {
    const existsKode = await prisma.aktivitas.findFirst({ where: { kode, NOT: { id } } });
    if (existsKode) return res.status(400).json({ error: 'Kode aktivitas sudah digunakan' });
  }
  await prisma.aktivitas.update({ where: { id }, data: { nama, kode, ...(typeof aktif === 'boolean' ? { aktif } : {}) } });
  // Update kode perusahaan jika kode berubah
  if (aktivitasLama && aktivitasLama.kode !== kode) {
    await prisma.kodePerusahaan.updateMany({
      where: {
        kode: aktivitasLama.kode,
        peserta: {
          aktivitas: nama
        }
      },
      data: {
        kode: kode
      }
    });
  }
  res.json({ success: true });
};

exports.delete = async (req, res) => {
  const { id } = req.body;
  await prisma.aktivitas.delete({ where: { id } });
  res.json({ success: true });
};

// Endpoint untuk mengupdate kode perusahaan secara bulk
exports.updateKodePerusahaan = async (req, res) => {
  try {
    const { aktivitasList } = req.body; // Array of { nama, kode }
    
    for (const aktivitas of aktivitasList) {
      // Update aktivitas di database
      await prisma.aktivitas.upsert({
        where: { nama: aktivitas.nama },
        update: { kode: aktivitas.kode },
        create: { nama: aktivitas.nama, kode: aktivitas.kode, aktif: false }
      });
      
      // Update kode perusahaan untuk peserta yang sudah ada
      await prisma.kodePerusahaan.updateMany({
        where: {
          kode: '', // Kode kosong
          peserta: {
            aktivitas: aktivitas.nama
          }
        },
        data: {
          kode: aktivitas.kode
        }
      });
    }
    
    res.json({ success: true, message: 'Kode perusahaan berhasil diupdate' });
  } catch (error) {
    console.error('Error updating kode perusahaan:', error);
    res.status(500).json({ error: 'Gagal mengupdate kode perusahaan', message: error.message });
  }
}; 

exports.getActive = async (req, res) => {
  const data = await prisma.aktivitas.findMany({ where: { aktif: true }, orderBy: { nama: 'asc' } });
  res.json(data);
}; 