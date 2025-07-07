const prisma = require('../../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminService = require('../../services/adminService');

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

exports.register = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password minimal 6 karakter' });
  }
  
  try {
    const result = await AdminService.createAdmin(username, password);
    
    if (result.success) {
      res.status(201).json({ 
        message: 'Admin berhasil ditambahkan', 
        admin: result.admin 
      });
    } else {
      res.status(400).json({ message: result.error });
    }
  } catch (error) {
    console.error('Register admin error:', error);
    res.status(500).json({ message: 'Gagal menambahkan admin' });
  }
};

// Tambah endpoint untuk manage admin
exports.getAllAdmins = async (req, res) => {
  try {
    const result = await AdminService.getAllAdmins();
    
    if (result.success) {
      res.json({ admins: result.admins });
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({ message: 'Gagal mengambil data admin' });
  }
};

exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;
  
  try {
    const result = await AdminService.updateAdmin(parseInt(id), { username, password });
    
    if (result.success) {
      res.json({ 
        message: 'Admin berhasil diupdate', 
        admin: result.admin 
      });
    } else {
      res.status(400).json({ message: result.error });
    }
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ message: 'Gagal update admin' });
  }
};

exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await AdminService.deleteAdmin(parseInt(id));
    
    if (result.success) {
      res.json({ message: 'Admin berhasil dihapus' });
    } else {
      res.status(400).json({ message: result.error });
    }
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Gagal hapus admin' });
  }
}; 