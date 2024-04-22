const ProductModel = require("../models/ProductModel");

const multer = require("multer");
const path = require("path");

const getAllProdut = async (req, res) => {
  const category = await ProductModel.find({}).populate("category");

  res.status(200).json(category);
};

const storeProduct = async (req, res) => {
  try {
    const upload = multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "uploads/products/"); // Dossier où les fichiers seront stockés
        },
        filename: function (req, file, cb) {
          // Nom de fichier personnalisé : utiliser le nom d'origine avec un timestamp pour éviter les collisions
          cb(null, `${Date.now()}${path.extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 }, // Limite de taille de fichier à 20 Mo
    }).single("image");

    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({
          message:
            "Une erreur s'est produite lors du téléchargement de l'image.",
          error: err,
        });
      }

      // Récupération des données du formulaire
      const { name, description, price, category } = req.body;

      // Construction du chemin de l'image
      const imagePath = `/uploads/products/${req.file.filename}`;

      // Création de la catégorie avec le nom et le chemin de l'image
      const product = await ProductModel.create({
        name: name,
        description: description,
        price: price,
        category: category,
        image: imagePath,
      });

      if (product) {
        res.status(201).json(product);
      } else {
        res.json({ message: "Erreur " });
      }
    });
  } catch (error) {
    res.json(error);
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findByIdAndDelete(id).populate(
      "category"
    );
    res.status(200).json({ message: "Produit deleted" });
  } catch (error) {
    res.json(error);
  }
};
const getOneProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await ProductModel.findById(id).populate("category");
    if (product) {
      res.status(200).json(product);
    }
    res.status(404).json({ message: "Produit non trouvée" });
  } catch (error) {
    res.json(error);
  }
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const product = await ProductModel.findByIdAndUpdate(
      id,
      { $set: { name: name, description: description, price: price } },
      { new: true }
    ).populate("category");
    if (product) {
      res.status(200).json(product);
    }
    res.status(404).json({ message: "Produit non trouvée" });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  getAllProdut,
  storeProduct,
  deleteProduct,
  updateProduct,
  getOneProduct,
};
