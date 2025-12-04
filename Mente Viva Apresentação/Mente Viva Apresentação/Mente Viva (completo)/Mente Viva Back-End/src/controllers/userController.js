const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: "Preencha todos os campos" });
    }

    // cria no banco
    const newUser = await User.create({
      nome,
      email,
      senha,
    });

    res.status(201).json({ message: "Usuário cadastrado!", user: newUser });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
};
