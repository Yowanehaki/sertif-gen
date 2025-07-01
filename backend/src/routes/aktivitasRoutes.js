const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/aktivitasController');

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/', ctrl.update);
router.delete('/', ctrl.delete);

module.exports = router; 
//protect