const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const devicesRouter = require('./routes/devices');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/meshiot';

app.use(cors());
app.use(express.json());
app.use('/api/devices', devicesRouter);
app.use('/api/users', require('./routes/users'));
app.use('/api/firmware', require('./routes/firmware'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/deployments', require('./routes/deployments'));
app.get('/api/health', (_req, res) => {
  return res.json({ status: 'ok' });
});

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected:', mongoUri);
    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
