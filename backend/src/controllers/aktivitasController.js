const prisma = require('../config/prisma');

exports.getAll = async (req, res) => {
  const data = await prisma.dashboard.findMany({ select: { aktivitas: true }, distinct: ['aktivitas'] });
  res.json(data.map(d => d.aktivitas));
};

exports.create = async (req, res) => {
  const { nama } = req.body;
  // Cek duplikat
  const exists = await prisma.dashboard.findFirst({ where: { aktivitas: nama } });
  if (exists) return res.status(400).json({ error: 'Aktivitas sudah ada' });
  // Tambah aktivitas (dummy: insert satu peserta dummy agar aktivitas muncul)
  await prisma.dashboard.create({ data: { id_sertif: require('nanoid').nanoid(8), nama: 'dummy', aktivitas: nama, tgl_submit: new Date(), kode_perusahaan: '-', konfirmasi_hadir: false } });
  res.json({ success: true });
};

exports.update = async (req, res) => {
  // Dummy: update semua peserta dengan aktivitas lama ke aktivitas baru
  const { oldNama, newNama } = req.body;
  await prisma.dashboard.updateMany({ where: { aktivitas: oldNama }, data: { aktivitas: newNama } });
  res.json({ success: true });
};

exports.delete = async (req, res) => {
  const { nama } = req.body;
  await prisma.dashboard.deleteMany({ where: { aktivitas: nama } });
  res.json({ success: true });
}; 