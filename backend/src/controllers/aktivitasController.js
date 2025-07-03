const prisma = require('../config/prisma');

exports.getAll = async (req, res) => {
  const data = await prisma.aktivitas.findMany({ orderBy: { nama: 'asc' } });
  res.json(data);
};

exports.create = async (req, res) => {
  const { nama, kode } = req.body;
  // Cek duplikat
  const exists = await prisma.aktivitas.findFirst({ where: { nama } });
  if (exists) return res.status(400).json({ error: 'Aktivitas sudah ada' });
  await prisma.aktivitas.create({ data: { nama, kode, aktif: false } });
  res.json({ success: true });
};

exports.update = async (req, res) => {
  const { id, nama, kode, aktif } = req.body;
  await prisma.aktivitas.update({ where: { id }, data: { nama, kode, ...(typeof aktif === 'boolean' ? { aktif } : {}) } });
  res.json({ success: true });
};

exports.delete = async (req, res) => {
  const { id } = req.body;
  await prisma.aktivitas.delete({ where: { id } });
  res.json({ success: true });
}; 