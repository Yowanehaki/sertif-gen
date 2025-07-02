const prisma = require('../config/prisma');

exports.getAll = async (req, res) => {
  const batchList = await prisma.batch.findMany({ orderBy: { nama: 'asc' } });
  res.json(batchList);
};

exports.create = async (req, res) => {
  const { nama } = req.body;
  const exists = await prisma.batch.findFirst({ where: { nama } });
  if (exists) return res.status(400).json({ error: 'Batch sudah ada' });
  const batch = await prisma.batch.create({ data: { nama } });
  res.json(batch);
};

exports.update = async (req, res) => {
  const { id, aktif } = req.body;
  const batch = await prisma.batch.update({ where: { id }, data: { aktif } });
  res.json(batch);
};

exports.delete = async (req, res) => {
  const { id } = req.body;
  await prisma.batch.delete({ where: { id } });
  res.json({ success: true });
}; 