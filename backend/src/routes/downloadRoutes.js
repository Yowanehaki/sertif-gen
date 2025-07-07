const express = require('express');
const path = require('path');
const router = express.Router();
const accessValidation = require('../middleware/admin/validationAccess');

// Protect semua route download - hanya admin yang bisa akses
router.use(accessValidation);

router.get('/certificate/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../../generated-certificates', req.params.filename);
  res.download(filePath);
});

module.exports = router; 

//protect