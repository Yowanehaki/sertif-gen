const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/certificate/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../../generated-certificates', req.params.filename);
  res.download(filePath);
});

module.exports = router; 