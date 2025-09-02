const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Media = require("../models/media");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage: storage });

// Rota para obter todas as mídias
router.get("/", authMiddleware, async (req, res) => {
  try {
    const mediaFiles = await Media.find().sort({ createdAt: -1 });
    res.json(mediaFiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para fazer upload de UMA OU VÁRIAS mídias (até 10 por vez)
router.post("/", authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "Nenhum ficheiro foi enviado." });
    }
    
    // Mapeia cada ficheiro para uma promessa de salvar no banco de dados
    const mediaPromises = req.files.map(file => {
      const newMedia = new Media({
        filename: file.filename,
        imageUrl: `/uploads/${file.filename}`
      });
      return newMedia.save();
    });
    
    const savedMedia = await Promise.all(mediaPromises); // Executa todas as promessas
    
    res.status(201).json(savedMedia); // Retorna um array com as mídias salvas
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Rota para apagar uma mídia
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) return res.status(404).json({ error: "Mídia não encontrada." });
        
        const filePath = path.join(__dirname, '../../public', media.imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Media.findByIdAndDelete(req.params.id);
        
        res.json({ message: "Mídia apagada com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao apagar mídia." });
    }
});

module.exports = router;