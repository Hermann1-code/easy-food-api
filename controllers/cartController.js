const CartModel = require("../models/CartModel");

const addToCart = async (req, res) => {
  const userId = req.decoded.user._id;
  const { productId } = req.params;
  console.log(productId)
  
  try {
    // Recherche du panier de l'utilisateur
    const cart = await CartModel.findOne( {userId});

    if (cart) {
      // Vérifie si le produit existe déjà dans le panier
      const productIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex !== -1) {
        // Incrémente la quantité du produit s'il existe déjà dans le panier
        cart.items[productIndex].quantity++;
      } else {
        // Ajoute le produit au panier
        cart.items.push({ productId, quantity: 1 });
        await cart.save();
    res.json(cart);
      }
    } else {
      // Crée un nouveau panier pour l'utilisateur
      const panier = await CartModel.create({
        userId:userId,
        items: [{ productId, quantity: 1 }],
      });
      await panier.save();
    res.json(panier);
      
    }

    // Enregistre les modifications du panier
    
  } catch (error) {
    res.status(500).json({
      message: "Une erreur s'est produite lors de l'ajout au panier",
      error: error.message,
    });
    console.log(error)
  }
};


const getCart = async (req, res) => {
  const id = req.decoded.user._id;
  try {
    const cart = await CartModel.findOne({ userId: id }).populate(
      "items.productId"
    );
    if (cart) {
      res.status(200).json(cart);
    } else {
      res.json({ message: "Aucun panier trouvé pour cet utilisateur" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du panier",
      error: error.message,
    });
  }
};

const desQty = async (req, res) => {
  const userId = req.decoded.user._id;
  const { productId } = req.params;

  try {
    // Recherche du panier de l'utilisateur
    const cart = await CartModel.findOne({ userId: userId });

    if (cart) {
      // Vérifie si le produit existe déjà dans le panier
      const productIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex !== -1) {
        // Décrémente la quantité du produit s'il existe déjà dans le panier
        if (cart.items[productIndex].quantity > 1) {
          cart.items[productIndex].quantity--;
        } else {
          // Si la quantité est égale à 1, supprime le produit du panier
          cart.items.splice(productIndex, 1);
        }

        // Enregistre les modifications du panier
        const cartUpdate = await cart.save();

        return res.json(cartUpdate);
      } else {
        return res
          .status(404)
          .json({ message: "Le produit n'existe pas dans le panier" });
      }
    } else {
      return res
        .status(404)
        .json({ message: "Aucun panier trouvé pour cet utilisateur" });
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "Une erreur s'est produite lors de la décrémentation de la quantité du produit",
      error: error.message,
    });
  }
};

module.exports = { addToCart, getCart, desQty };
