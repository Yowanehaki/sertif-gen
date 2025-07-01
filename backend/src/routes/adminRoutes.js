const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');

router.post('/login', ctrl.login);
router.get('/validate', ctrl.validate);

module.exports = router; 