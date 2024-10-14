const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const attendenceRoutes = require('./routes/attendence');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/attendence', attendenceRoutes);

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
