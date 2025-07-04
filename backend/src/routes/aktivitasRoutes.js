const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/aktivitasController.js');

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/', ctrl.update);
router.delete('/', ctrl.delete);
router.post('/update-kode-perusahaan', ctrl.updateKodePerusahaan);

module.exports = router; 
//protect