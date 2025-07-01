const prisma = require("../config/prisma.js");
const bcrypt = require("bcrypt");

// Membuat admin baru
const createAdmin = async (username, password) => {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.admin.create({
    data: {
      username,
      password: hashed,
    },
  });
};

// Mengambil semua admin
const getAdmin = async () => {
  return prisma.admin.findMany();
};

// Fungsi untuk membuat admin default jika belum ada
const createDefaultAdmin = async () => {
  const admin = await prisma.admin.findFirst({ where: { username: 'admin' } });
  if (!admin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashed,
      },
    });
    console.log('Default admin created: admin/admin123');
  } else {
    console.log('Default admin already exists');
  }
};

module.exports = {
  createAdmin,
  getAdmin,
  createDefaultAdmin,
};