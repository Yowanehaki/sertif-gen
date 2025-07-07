const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin/adminController.js');
const accessValidation = require('../middleware/admin/validationAccess');

router.post('/login', ctrl.login);
router.get('/validate', ctrl.validate);


// Route untuk manage admin - PROTECTED (admin only)
router.post('/register', accessValidation, ctrl.register);
router.get('/all', accessValidation, ctrl.getAllAdmins);
router.put('/:id', accessValidation, ctrl.updateAdmin);
router.delete('/:id', accessValidation, ctrl.deleteAdmin);

module.exports = router; 