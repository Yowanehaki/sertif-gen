const bcrypt = require("bcrypt");
const { getAdminAccount } = require("./adminAccount.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const adminAuth = async (req, res) => {
  const { body } = req;

  if (!body.username || !body.password) {
    return res.status(403).json({
      message: "Username atau password tidak boleh kosong",
    });
  }

  try {
    const admin = await getAdminAccount();
    if (!admin) {
      return res.status(404).json({ message: "Admin tidak ditemukan" });
    }
    const isPasswordValid = await bcrypt.compare(body.password, admin.password);
    const payload = {
      id: admin.id,
      username: admin.username,
    };

    const secretKey = process.env.JWT_SECRET;
    const expiresIn = 60 * 60 * 48; // Token berlaku 48 jam
    const token = jwt.sign(payload, secretKey, { expiresIn: expiresIn });

    if (body.username === admin.username) {
      if (isPasswordValid) {
        return res.status(200).json({
          message: "Login Berhasil",
          data: {
            username: admin.username,
          },
          token: token,
        });
      } else {
        return res.status(401).json({
          message: "Password salah",
        });
      }
    } else {
      return res.status(401).json({
        message: "Username salah",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Kegagalan dari server saat proses login",
    });
  }
};

module.exports = adminAuth;