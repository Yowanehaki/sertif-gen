const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');
const accessValidation = require('../middleware/admin/validationAccess');

// Protect semua route batch - hanya admin yang bisa akses
router.use(accessValidation);

router.get('/', batchController.getAll);
router.post('/', batchController.create);
router.patch('/', batchController.update);
router.delete('/', batchController.delete);

module.exports = router; 