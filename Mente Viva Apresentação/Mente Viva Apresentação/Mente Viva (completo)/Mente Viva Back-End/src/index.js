require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const diarioRoutes = require('./routes/diarioRoutes');

const app = express();
connectDB();

// 🔥 CORS CORRETO
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());

// Rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/diario', diarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
  console.log("MongoDB conectado");
});
