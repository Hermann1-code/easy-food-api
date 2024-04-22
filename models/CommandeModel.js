const mongoose = require("mongoose");

const commandeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    commandes: [
      {
        items: [
          {
            productId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
              default: 1,
            },
            price: {
              type: Number,
              required: true,
            },
          },
        ],
        total: {
          type: Number,
          required: true,
        },
        fraisLivraison: {
          type: Number,
          required: true,
        },
        lieuLivraison: {
          type: String,
        },
        status: {
          type: String,
          enum: ["en attente", "en cours", "livrée"],
          default: "en attente",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CommandeModel = mongoose.model("Commande", commandeSchema);

module.exports = CommandeModel;
