const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// CORREÇÃO: Alterado de 'user' para 'User' para corresponder ao modelo
const User = require('../models/user'); 

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ error: "Nome de utilizador e senha são obrigatórios." });
    }

    const user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ error: "Utilizador não encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  
  } catch (err) {
    console.error(">>> ERRO FATAL NA ROTA DE LOGIN:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
