const express = require("express");
const Product = require("../models/product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ROTA PÚBLICA: Obter todos os produtos
router.get("/", async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ROTA PÚBLICA: Obter produtos em destaque, ordenados por 'featuredOrder'
router.get("/featured", async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).sort({ featuredOrder: 'asc' });
        res.json(featuredProducts);
    } catch (err) {
        res.status(500).json({ error: "Erro ao obter produtos em destaque." });
    }
});

// ROTA PROTEGIDA: Obter um único produto por ID
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Produto não encontrado" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ROTA PROTEGIDA: Adicionar produto (sem upload de imagem, pois agora usa a biblioteca)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { category, name, price, description, imageUrl } = req.body;
        if (!imageUrl) {
            return res.status(400).json({ error: "A imagem do produto é obrigatória." });
        }
        const newProduct = new Product({ category, name, price, description, imageUrl });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// ROTA PROTEGIDA: Atualizar produto (modificada para lidar com isFeatured)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { isFeatured, ...updateData } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Produto não encontrado" });
        if (typeof isFeatured === 'boolean' && product.isFeatured !== isFeatured) {
            product.isFeatured = isFeatured;
            if (isFeatured) {
                const maxOrder = await Product.findOne({ isFeatured: true }).sort({ featuredOrder: -1 });
                product.featuredOrder = maxOrder ? maxOrder.featuredOrder + 1 : 0;
            }
        }
        Object.assign(product, updateData);
        await product.save();
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ROTA PROTEGIDA: Reordenar produtos em destaque
router.put("/featured/reorder", authMiddleware, async (req, res) => {
    try {
        const { orderedProducts } = req.body;
        const updatePromises = orderedProducts.map((productId, index) => 
            Product.findByIdAndUpdate(productId, { featuredOrder: index })
        );
        await Promise.all(updatePromises);
        res.json({ message: "Destaques reordenados com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao reordenar destaques." });
    }
});

// ROTA PROTEGIDA: Apagar produto
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
