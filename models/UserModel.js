const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    noms: {
      type: String,
      //   unique: true,
      trim: true,
      //   required: true,
    },
    prenoms: {
      type: String,
      //   unique: true,
      trim: true,
      //   required: true,
    },
    verify: {
      type: Boolean,
    },
    quartier: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      //   required: true,
    },
    numero: {
      type: String,
      //   required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate(); // Obtenir les données de mise à jour
  if (update.password) {
    // Vérifier si le mot de passe est inclus dans la mise à jour
    const hash = await bcrypt.hash(update.password, 10); // Hacher le mot de passe
    this.setUpdate({ ...update, password: hash }); // Mettre à jour le mot de passe haché dans les données de mise à jour
  }
  next();
});

userSchema.methods.isValidePassword = async function (password) {
  const user = this;
  const isSame = await bcrypt.compare(password, user.password);
  return isSame;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
