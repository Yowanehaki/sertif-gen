const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/aktivitasController.js');
const accessValidation = require('../middleware/admin/validationAccess');

// Protect semua route aktivitas - hanya admin yang bisa akses
router.use(accessValidation);

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/', ctrl.update);
router.delete('/', ctrl.delete);
router.post('/update-kode-perusahaan', ctrl.updateKodePerusahaan);
router.get('/active', ctrl.getActive);

module.exports = router; 