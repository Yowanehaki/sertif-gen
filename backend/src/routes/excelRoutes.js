const express = require('express');
const router = express.Router();
const ExcelController = require('../controllers/excelController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/template', ExcelController.downloadTemplate);
router.post('/upload', upload.single('file'), ExcelController.uploadExcel);

module.exports = router;
