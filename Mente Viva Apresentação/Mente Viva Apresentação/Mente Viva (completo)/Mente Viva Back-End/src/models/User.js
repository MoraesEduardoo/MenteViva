const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nome: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  senha: { 
    type: String, 
    required: true 
  },
  telefone: String,
  dataNasc: String,
  criadoEm: { 
    type: Date, 
    default: Date.now 
  }
});

// === HASH DA SENHA ANTES DE SALVAR ===
userSchema.pre('save', async function(next) {
  try {
    // Se a senha NÃO foi modificada → não reprocessa o hash
    if (!this.isModified('senha')) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();

  } catch (err) {
    next(err);
  }
});

// === MÉTODO PARA COMPARAR A SENHA NO LOGIN ===
userSchema.methods.compararSenha = async function(senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model('User', userSchema);
