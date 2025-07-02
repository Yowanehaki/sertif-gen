const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin/adminController.js');

router.post('/login', ctrl.login);
router.get('/validate', ctrl.validate);

module.exports = router; 