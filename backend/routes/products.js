const express = require("express");
const Product = require("../models/product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Rota pública - Obter todos os produtos
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota protegida - Obter um único produto por ID
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Produto não encontrado" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para adicionar produto (sem upload, recebe imageUrl)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { category, name, price, description, imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ error: "É necessário selecionar uma imagem." });
    
    const newProduct = new Product({ category, name, price, description, imageUrl });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Rota para atualizar produto (sem upload, recebe imageUrl)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { category, name, price, description, imageUrl } = req.body;
        const updateData = { category, name, price, description, imageUrl };
        
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedProduct) return res.status(404).json({ error: "Produto não encontrado" });
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Rota protegida - Apagar produto
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ error: "Produto não encontrado" });
        res.json({ message: "Produto apagado com sucesso" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
