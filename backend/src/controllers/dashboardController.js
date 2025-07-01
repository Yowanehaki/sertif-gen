const prisma = require('../config/prisma');
const { nanoid } = require('nanoid');

exports.getAll = async (req, res) => {
  const { nama, aktivitas, tgl_submit } = req.query;
  const where = {};
  if (nama) where.nama = { contains: nama };
  if (aktivitas) where.aktivitas = aktivitas;
  if (tgl_submit) where.tgl_submit = new Date(tgl_submit);
  const data = await prisma.dashboard.findMany({ where, orderBy: { tgl_submit: 'desc' } });
  res.json(data);
};

exports.getById = async (req, res) => {
  const { id_sertif } = req.params;
  const data = await prisma.dashboard.findUnique({ where: { id_sertif } });
  if (!data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
};

exports.create = async (req, res) => {
  const { nama, aktivitas, tgl_submit, kode_perusahaan, konfirmasi_hadir } = req.body;
  const id_sertif = nanoid(8);
  const data = await prisma.dashboard.create({
    data: { id_sertif, nama, aktivitas, tgl_submit: new Date(tgl_submit), kode_perusahaan, konfirmasi_hadir }
  });
  res.json(data);
};

exports.update = async (req, res) => {
  const { id_sertif } = req.params;
  const { nama, aktivitas, tgl_submit, kode_perusahaan, konfirmasi_hadir } = req.body;
  const data = await prisma.dashboard.update({
    where: { id_sertif },
    data: { nama, aktivitas, tgl_submit: new Date(tgl_submit), kode_perusahaan, konfirmasi_hadir }
  });
  res.json(data);
};

exports.delete = async (req, res) => {
  const { id_sertif } = req.params;
  await prisma.dashboard.delete({ where: { id_sertif } });
  res.json({ success: true });
};

exports.generateSertifikat = async (req, res) => {
  const { id_sertif } = req.params;
  const { nama_penguji, jabatan_penguji, tgl_terbit_sertif, tandatangan } = req.body;
  const data = await prisma.dashboard.update({
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