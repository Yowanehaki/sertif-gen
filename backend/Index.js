const express = require('express');
const cors = require('cors');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const aktivitasRoutes = require('./src/routes/aktivitasRoutes');
const downloadRoutes = require('./src/routes/downloadRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const path = require('path');
const { createDefaultAdmin } = require('./src/models/userAdmin.js');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/dashboard', dashboardRoutes);
app.use('/admin', adminRoutes);
app.use('/aktivitas', aktivitasRoutes);
app.use('/download', downloadRoutes);
app.use('/upload', uploadRoutes);

// Static serve for generated certificates and signatures
app.use('/generated-certificates', express.static(path.join(__dirname, 'generated-certificates')));
app.use('/uploads/signatures', express.static(path.join(__dirname, 'uploads/signatures')));

app.get('/', (req, res) => res.send('Sertif-Gen API Ready!'));

(async () => {
  await createDefaultAdmin();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();