const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');

router.get('/', batchController.getAll);
router.post('/', batchController.create);
router.patch('/', batchController.update);
router.delete('/', batchController.delete);

module.exports = router; 