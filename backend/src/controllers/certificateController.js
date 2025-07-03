const { nanoid } = require('nanoid');
const { customAlphabet } = require('nanoid');

function generateIdWithDigits(minDigits = 2, length = 8) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const nanoidCustom = customAlphabet(alphabet, length);
  let id;
  do {
    id = nanoidCustom();
  } while ((id.match(/\d/g) || []).length < minDigits);
  return id;
}

exports.create = async (req, res) => {
  const { nama, aktivitas, tgl_submit, kode_perusahaan, konfirmasi_hadir } = req.body;
  const id_sertif = generateIdWithDigits(2, 8);
  const data = await prisma.dashboard.create({
    data: { id_sertif, nama, aktivitas, tgl_submit: new Date(tgl_submit), kode_perusahaan, konfirmasi_hadir }
  });
  res.json(data);
};