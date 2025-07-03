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

module.exports = {
  createAdmin,
  getAdmin,
  createDefaultAdmin,
};