const { constants } = require("fs/promises");
const CategoryModel = require("../models/CategoryModel");
const fs = require("fs");

const multer = require("multer");
const path = require("path");
const ProductModel = require("../models/ProductModel");

const getAllCategory = async (req, res) => {
  const category = await CategoryModel.find({});

  res.status(200).json(category);
};
const getCategoryProduct = async (req, res) => {
  const { id } = req.params;
  const products = await ProductModel.find({ category: id });

  res.status(200).json(products);
};

const storeCategory = async (req, res) => {
  try {
    const upload = multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "uploads/categories/"); // Dossier où les fichiers seront stockés
        },
        filename: function (req, file, cb) {
          // Nom de fichier personnalisé : utiliser le nom d'origine avec un timestamp pour éviter les collisions
          cb(null, `${Date.now()}${path.extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 }, // Limite de taille de fichier à 20 Mo
    }).single("image");

    // Utilisez l'instance de Multer pour traiter la requête et télécharger le fichier
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({
          message:
            "Une erreur s'est produite lors du téléchargement de l'image.",
          error: err,
        });
      }

      // Récupération des données du formulaire
      const { name } = req.body;

      // Construction du chemin de l'image
      const imagePath = `/uploads/categories/${req.file.filename}`;

      // Création de la catégorie avec le nom et le chemin de l'image
      const category = await CategoryModel.create({
        name: name,
        image: imagePath,
      });

      console.log(category); // Log de la catégorie créée

      res.status(201).json(category);
    });
  } catch (error) {
    res.status(500).json({
      message: "Une erreur s'est produite lors de la création de la catégorie.",
      error: error,
    });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await CategoryModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Catégory deleted" });
  } catch (error) {
    res.json(error);
  }
};
const getOneCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await CategoryModel.findById(id);
    if (category) {
      res.status(200).json(category);
    }
    res.status(404).json({ message: "Category non trouvée" });
  } catch (error) {
    res.json(error);
  }
};
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: { name: name } },
      { new: true }
    );
    if (category) {
      res.status(200).json(category);
    }
    res.status(404).json({ message: "Category non trouvée" });
  } catch (error) {
    res.json(error);
  }
};

module.exports = {
  getAllCategory,
  storeCategory,
  deleteCategory,
  getOneCategory,
  updateCategory,
  getCategoryProduct,
};
