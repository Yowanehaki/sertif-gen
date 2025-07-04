const express = require('express');
const router = express.Router();
const ExcelController = require('../controllers/excelController');
const multer = require('multer');
const upload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // .xlsx
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xls, .xlsx) are allowed!'), false);
    }
  }
});

router.get('/template', ExcelController.downloadTemplate);
router.post('/upload', upload.single('file'), ExcelController.uploadExcel);

module.exports = router;
