const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function createExcelTemplate() {
  const templateData = [
    { Nama: 'Budi Santoso', Aktivitas: 'Try Out CPNS 2025', Batch: 'VII' },
    { Nama: 'Siti Aminah', Aktivitas: 'Seminar Digital Marketing', Batch: 'I' },
  ];
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  worksheet['!cols'] = [
    { wch: 20 }, { wch: 30 }, { wch: 8 }
  ];
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Peserta');
  const assetsDir = path.join(__dirname, '../../assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  // XLSX
  const templatePathXlsx = path.join(assetsDir, 'template-peserta.xlsx');
  const wboutXlsx = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  fs.writeFileSync(templatePathXlsx, wboutXlsx);

  // XLS
  const templatePathXls = path.join(assetsDir, 'template-peserta.xls');
  const wboutXls = XLSX.write(workbook, { bookType: 'xls', type: 'buffer' });
  fs.writeFileSync(templatePathXls, wboutXls);

  return { templatePathXlsx, templatePathXls };
}

// Create template if this file is run directly
if (require.main === module) {
  createExcelTemplate();
}

module.exports = createExcelTemplate; 