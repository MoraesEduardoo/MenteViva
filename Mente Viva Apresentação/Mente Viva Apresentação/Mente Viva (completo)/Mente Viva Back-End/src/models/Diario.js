const mongoose = require('mongoose');

const diarioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  data:   { type: String, default: () => new Date().toISOString().split("T")[0] },
  texto:  { type: String, required: true },
  mood:   { type: String, enum: ['feliz', 'neutro', 'triste'], default: 'neutro' },
  tags:   [String]
});

module.exports = mongoose.model('Diario', diarioSchema);