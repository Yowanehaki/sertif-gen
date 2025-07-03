const prisma = require('../config/prisma');

// GET status aktif/nonaktif FormUser
exports.getFormUserStatus = async (req, res) => {
  let setting = await prisma.settings.findUnique({ where: { key: 'formUserAktif' } });
  if (!setting) {
    // Default aktif jika belum ada
    setting = await prisma.settings.create({ data: { key: 'formUserAktif', value: 'true' } });
  }
  res.json({ aktif: setting.value === 'true' });
};

// SET status aktif/nonaktif FormUser
exports.setFormUserStatus = async (req, res) => {
  const { aktif } = req.body;
  if (typeof aktif !== 'boolean') return res.status(400).json({ error: 'aktif harus boolean' });
  await prisma.settings.upsert({
    where: { key: 'formUserAktif' },
    update: { value: aktif ? 'true' : 'false' },
    create: { key: 'formUserAktif', value: aktif ? 'true' : 'false' },
  });
  res.json({ success: true, aktif });
}; 