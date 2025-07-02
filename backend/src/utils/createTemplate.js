const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function createExcelTemplate() {
  const templateData = [
    { NoUrut: 1, Nama: 'Budi Santoso', Aktivitas: 'Try Out CPNS 2025', Batch: 'VII' },
    { NoUrut: 2, Nama: 'Siti Aminah', Aktivitas: 'Try Out CPNS 2025', Batch: 'VII' },
    { NoUrut: 3, Nama: 'Andi Wijaya', Aktivitas: 'Seminar Digital Marketing', Batch: 'I' },
  ];
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  worksheet['!cols'] = [
    { wch: 8 }, { wch: 20 }, { wch: 30 }, { wch: 8 }
  ];
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Peserta');
  const assetsDir = path.join(__dirname, '../../assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
  const templatePath = path.join(assetsDir, 'template-peserta.xlsx');
  // Tulis file dengan buffer agar valid
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  fs.writeFileSync(templatePath, wbout);
  return templatePath;
}

// Create template if this file is run directly
if (require.main === module) {
  createExcelTemplate();
}

module.exports = createExcelTemplate; 