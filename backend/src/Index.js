const express = require('express');
const cors = require('cors');
const dashboardRoutes = require('./routes/dashboardRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const aktivitasRoutes = require('./routes/aktivitasRoutes.js');
const downloadRoutes = require('./routes/downloadRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const serviceRoutes = require('./routes/serviceRoutes.js');
const batchRoutes = require('./routes/batchRoutes');
const excelRoutes = require('./routes/excelRoutes.js');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/aktivitas', aktivitasRoutes);
app.use('/download', downloadRoutes);
app.use('/upload', uploadRoutes);
app.use('/service', serviceRoutes);
app.use('/batch', batchRoutes);
app.use('/api/excel', excelRoutes);

// Static serve for generated certificates and signatures
app.use('/generated-certificates', express.static(path.join(__dirname, 'generated-certificates')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => res.send('Backend Sertif Ready Gan!'));

(async () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();