const CartModel = require("../models/CartModel");
const CommandesModel = require("../models/CommandeModel");


const getCommandes = async (req, res) => {


  try {
    const commandes = await CommandesModel.find({});
    if(commandes){
      res.json(commandes);
    } else {
      res.json({data:'0'});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
};
const getUserCommandes = async (req, res) => {
  const userId = req.decoded.user._id;

  try {
    const commandes = await CommandesModel.findOne({ userId: userId });
    if(commandes){
      res.json(commandes.commandes);
    } else {
      res.json({'message':'Pas de commandes'});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
};


const setPosition = async (req, res) => {
  const userId = req.decoded.user._id;
  const { id } = req.params;
  const { geo } = req.body;

  try {
    const userCommandes = await CommandesModel.findOne({
      userId: userId,
    });

    if (!userCommandes) {
      return res
        .status(404)
        .json({ message: "Aucune commande trouvée pour cet utilisateur" });
    }

    const commande = userCommandes.commandes.find(
      (commande) => commande._id == id
    );
    // res.json(userCommandes.commandes);

    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    commande.lieuLivraison = geo;
    await userCommandes.save();

    res.json(commande);

    // res.json(updat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const setCommande = async (req, res) => {
  const userId = req.decoded.user._id;

  const userCommandes = await CommandesModel.findOne({ userId: userId });

  try {
    const getCart = await CartModel.findOne({ userId: userId }).populate(
      "items.productId"
    );

    const totalProduits = getCart.items.reduce((acc, item) => {
      return acc + item.productId.price * item.quantity;
    }, 0);

    // Vérifier si l'utilisateur a déjà des commandes enregistrées
    const userCommandes = await CommandesModel.findOne({ userId: userId });

    if (userCommandes) {
      // Si des commandes existent déjà, ajouter une nouvelle commande
      const nouvelleCommande = {
        items: getCart.items.map((item) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
        })),
        total: totalProduits,
        fraisLivraison: 500, // Prix de livraison fixé à 500
      };

      userCommandes.commandes.push(nouvelleCommande);
      await userCommandes.save();

      res.json(userCommandes.commandes[userCommandes.commandes.length - 1]);
    } else {
      // Si l'utilisateur n'a pas encore de commandes, créer une nouvelle commande
      const nouvelleCommande = await CommandesModel.create({
        userId: userId,
        commandes: [
          {
            items: getCart.items.map((item) => ({
              productId: item.productId._id,
              quantity: item.quantity,
              price: item.productId.price,
            })),
            total: totalProduits,
            fraisLivraison: 500, // Prix de livraison fixé à 500
          },
        ],
      });

      res.json(nouvelleCommande);
    }
    // await CartModel.deleteOne({ userId: userId });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Une erreur est survenue lors de la création de la commande.",
    });
  }
};

module.exports = { getUserCommandes, setCommande, setPosition,getCommandes };
