const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mapping aktivitas ke kodeAktivitas
const aktivitasMap = {
  'Try Out CPNS 2025': 'TO-CoA',
  'Seminar Digital Marketing': 'SDM',
  'Seminar Kewirausahaan': 'SKW',
  'Try Out UTBK 2025': 'TO-UTBK',
  'Webinar Teknologi AI': 'WTAI',
  'Workshop Design Thinking': 'WDT',
};

class ExcelService {
  static parseExcelFile(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (jsonData.length < 2) throw new Error('File Excel harus ada header dan data');
      const headers = jsonData[0];
      const dataRows = jsonData.slice(1);
      // Mapping header
      const headerMapping = {};
      headers.forEach((header, idx) => {
        if (!header) return;
        const h = header.toString().trim().toLowerCase();
        if (h === 'nourut') headerMapping.noUrut = idx;
        if (h === 'nama') headerMapping.nama = idx;
        if (h === 'aktivitas') headerMapping.aktivitas = idx;
        if (h === 'batch') headerMapping.batch = idx;
      });
      // Validasi kolom wajib
      ['noUrut', 'nama', 'aktivitas', 'batch'].forEach(field => {
        if (headerMapping[field] === undefined) throw new Error(`Kolom ${field} tidak ditemukan`);
      });
      // Proses data
      const tahun = new Date().getFullYear();
      const kodePerusahaan = 'GRH';
      return dataRows
        .filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''))
        .map(row => {
          const noUrut = String(row[headerMapping.noUrut]).padStart(4, '0');
          const nama = row[headerMapping.nama];
          const aktivitas = row[headerMapping.aktivitas];
          const batch = row[headerMapping.batch];
          const kodeAktivitas = aktivitasMap[aktivitas] || 'UNK';
          const companyCode = `${kodePerusahaan}/${kodeAktivitas}/${tahun}/${batch}/${noUrut}`;
          return {
            nama,
            aktivitas,
            batch,
            kode_perusahaan: companyCode,
            tgl_submit: new Date(),
            konfirmasi_hadir: true,
          };
        });
    } catch (error) {
      throw new Error(`Error parsing Excel file: ${error.message}`);
    }
  }

  static async saveParticipantsToDatabase(participants) {
    try {
      const saved = [];
      for (const p of participants) {
        const peserta = await prisma.dashboard.create({ data: p });
        saved.push(peserta);
      }
      return saved;
    } catch (error) {
      throw new Error(`Error saving to database: ${error.message}`);
    }
  }
}

module.exports = ExcelService; 