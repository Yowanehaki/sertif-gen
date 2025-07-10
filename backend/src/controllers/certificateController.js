const { nanoid } = require('nanoid');
const { customAlphabet } = require('nanoid');
const prisma = require('../config/prisma');

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
  const { nama, aktivitas, tgl_submit, kode_perusahaan, verifikasi } = req.body;
  const id_sertif = generateIdWithDigits(2, 8);
  const data = await prisma.peserta.create({
    data: { id_sertif, nama, aktivitas, tgl_submit: new Date(tgl_submit), verifikasi }
  });
  res.json(data);
};