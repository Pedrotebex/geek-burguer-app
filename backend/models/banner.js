const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  // Pode adicionar outros campos no futuro, como título ou link
}, { timestamps: true });

module.exports = mongoose.model("Banner", bannerSchema);
