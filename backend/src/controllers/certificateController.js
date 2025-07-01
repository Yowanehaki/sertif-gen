const { nanoid } = require('nanoid');

exports.create = async (req, res) => {
  const { nama, aktivitas, tgl_submit, kode_perusahaan, konfirmasi_hadir } = req.body;
  const id_sertif = nanoid(8); // hasil: 8 karakter random, misal '11v2vcxj'
  const data = await prisma.dashboard.create({
    data: { id_sertif, nama, aktivitas, tgl_submit: new Date(tgl_submit), kode_perusahaan, konfirmasi_hadir }
  });
  res.json(data);
};