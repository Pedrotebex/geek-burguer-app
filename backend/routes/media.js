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

// Obter todas as mídias
router.get("/", authMiddleware, async (req, res) => {
  try {
    const mediaFiles = await Media.find().sort({ createdAt: -1 });
    res.json(mediaFiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fazer upload de uma nova mídia
router.post("/", authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Nenhum ficheiro foi enviado." });
    
    const newMedia = new Media({
      filename: req.file.filename,
      imageUrl: `/uploads/${req.file.filename}`
    });
    
    await newMedia.save();
    res.status(201).json(newMedia);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Apagar uma mídia
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) return res.status(404).json({ error: "Mídia não encontrada." });
        
        // Apaga o ficheiro do sistema
        const filePath = path.join(__dirname, '../../public', media.imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Apaga o registo da base de dados
        await Media.findByIdAndDelete(req.params.id);
        
        res.json({ message: "Mídia apagada com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao apagar mídia." });
    }
});


module.exports = router;
