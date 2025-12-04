// src/routes/authRoutes.js
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "segredo-super-seguro";

// ============================
// 📌 REGISTRO
// ============================
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha, telefone, dataNasc } = req.body;

    const existe = await User.findOne({ email: email.toLowerCase() });
    if (existe) {
      return res.status(400).json({ message: "Email já cadastrado." });
    }

    const user = await User.create({
      nome,
      email: email.toLowerCase(),
      senha,
      telefone,
      dataNasc
    });

    return res.status(201).json({
      id: user._id,
      nome: user.nome,
      email: user.email
    });
  } catch (err) {
    console.error("Erro ao registrar:", err);
    res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
});

// ============================
// 📌 LOGIN
// ============================
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.compararSenha(senha))) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email
      }
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ message: "Erro ao fazer login." });
  }
});

module.exports = router;
