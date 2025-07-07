const prisma = require('../../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  // Hanya izinkan POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed. Hanya POST yang diizinkan.' });
  }

  // Coba parsing body jika belum ada
  let body = req.body;
  if (!body) {
    // Fallback: coba parse manual jika Content-Type x-www-form-urlencoded
    if (req.headers['content-type'] && req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
      let rawData = '';
      req.on('data', chunk => { rawData += chunk; });
      req.on('end', () => {
        const params = new URLSearchParams(rawData);
        body = Object.fromEntries(params.entries());
        lanjutLogin(body, req, res);
      });
      return;
    }
    return res.status(400).json({ message: 'Request body tidak ditemukan. Pastikan Content-Type: application/json atau x-www-form-urlencoded dan body dikirim.' });
  }
  lanjutLogin(body, req, res);
};

function lanjutLogin(body, req, res) {
  const { username, password } = body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }
  prisma.admin.findUnique({ where: { username } })
    .then(admin => {
      if (!admin) return res.status(401).json({ message: 'Username atau password salah' });
      return bcrypt.compare(password, admin.password).then(valid => {
        if (!valid) return res.status(401).json({ message: 'Username atau password salah' });
        const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ message: 'Login Berhasil', token });
      });
    })
    .catch(err => {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
}

exports.validate = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ valid: false });
  }
}; 