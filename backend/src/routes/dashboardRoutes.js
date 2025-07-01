const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dashboardController');

router.get('/', ctrl.getAll);
router.get('/:id_sertif', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id_sertif', ctrl.update);
router.delete('/:id_sertif', ctrl.delete);
router.put('/:id_sertif/generate', ctrl.generateSertifikat);
router.post('/bulk', ctrl.bulkUpload);

module.exports = router; 