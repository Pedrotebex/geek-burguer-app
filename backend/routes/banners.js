const express = require("express");
const Banner = require("../models/banner");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ROTA PÚBLICA: Obter todos os banners para exibir no carrossel
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: 'desc' });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter banners." });
  }
});

// ROTA PROTEGIDA: Adicionar um novo banner
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
        return res.status(400).json({ error: "O URL da imagem é obrigatório." });
    }
    const newBanner = new Banner({ imageUrl });
    await newBanner.save();
    res.status(201).json(newBanner);
  } catch (err) {
    res.status(400).json({ error: "Erro ao adicionar banner." });
  }
});

// ROTA PROTEGIDA: Apagar um banner
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) return res.status(404).json({ error: "Banner não encontrado." });
        res.json({ message: "Banner apagado com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao apagar banner." });
    }
});

module.exports = router;