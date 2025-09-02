const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const User = require("./models/user");
const Product = require("./models/product");
const Media = require("./models/media");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const mediaRoutes = require("./routes/media");
const bannerRoutes = require("./routes/banners"); // <-- Adicionado

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Rotas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/banners", bannerRoutes); // <-- Adicionado

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB conectado!");
  createDefaultAdmin(); 
  syncMediaLibrary();
})
.catch(err => console.error("Erro ao conectar MongoDB:", err));

const createDefaultAdmin = async () => {
  try {
    const adminName = 'admin';
    const adminExists = await User.findOne({ name: adminName });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('1234', 10);
      const adminUser = new User({ name: adminName, email: 'admin@example.com', password: hashedPassword, role: 'admin' });
      await adminUser.save();
      console.log('Utilizador "admin" criado com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao criar utilizador admin:', error);
  }
};

const syncMediaLibrary = async () => {
    try {
        const uploadDir = path.join(__dirname, '../public/uploads');
        if (!fs.existsSync(uploadDir)) return;

        const files = fs.readdirSync(uploadDir);
        for (const file of files) {
            const imageUrl = `/uploads/${file}`;
            const mediaExists = await Media.findOne({ imageUrl: imageUrl });

            if (!mediaExists) {
                const newMedia = new Media({
                    filename: file,
                    imageUrl: imageUrl,
                });
                await newMedia.save();
                console.log(`Mídia '${file}' sincronizada com a biblioteca.`);
            }
        }
    } catch (error) {
        console.error('Erro ao sincronizar a biblioteca de mídias:', error);
    }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));
