const express = require('express');
const Diario = require('../models/Diario');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.use(auth);

// LISTAR REGISTROS
router.get('/', async (req, res) => {
  try {
    const itens = await Diario.find({ userId: req.user.userId }).sort({ ts: -1 });
    res.json(itens);
  } catch (err) {
    console.error("Erro ao listar diário:", err);
    res.status(500).json({ message: "Erro ao listar registros" });
  }
});

// CRIAR REGISTRO
router.post('/', async (req, res) => {
  try {
    const { texto, mood, tags, data } = req.body;

    if (!texto) {
      return res.status(400).json({ message: "Texto é obrigatório" });
    }

    const item = await Diario.create({
      userId: req.user.userId,
      texto,
      mood: mood || "neutro",
      tags: tags || [],
      data: data || new Date().toISOString().split("T")[0]  // YYYY-MM-DD
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("Erro ao criar diário:", err);
    res.status(500).json({ message: "Erro ao criar registro" });
  }
});

// EDITAR
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { texto, mood, tags } = req.body;

    const item = await Diario.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { texto, mood, tags },
      { new: true }
    );

    if (!item) return res.status(404).json({ message: 'Registro não encontrado' });

    res.json(item);
  } catch (err) {
    console.error("Erro ao editar diário:", err);
    res.status(500).json({ message: "Erro ao atualizar registro" });
  }
});

// DELETAR
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const del = await Diario.findOneAndDelete({ _id: id, userId: req.user.userId });

    if (!del) return res.status(404).json({ message: 'Registro não encontrado' });

    res.json({ ok: true });
  } catch (err) {
    console.error("Erro ao deletar diário:", err);
    res.status(500).json({ message: "Erro ao deletar registro" });
  }
});

module.exports = router;
