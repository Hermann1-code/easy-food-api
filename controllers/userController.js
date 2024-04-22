const sendEmail = require("../lib/registerSendMail");
const OTPModel = require("../models/OTPModel");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const setEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const verifyCode = Math.floor(100000 + Math.random() * 900000);

    // Vérifier si l'utilisateur existe déjà
    const user = await UserModel.findOne({ email: email });

    if (user) {
      if (user.verify === true) {
        res.status(500).json({ message: "Email deja utilisé" });
      }
      // Si l'utilisateur existe, vérifier s'il a déjà un code OTP
      const otp = await OTPModel.findOne({ email: email });

      if (otp) {
        // Mettre à jour le code OTP existant
        otp = await OTPModel.findOneAndUpdate(
          { email: email },
          { $set: { verifyCode: verifyCode } },
          { new: true }
        );

        // Envoyer l'e-mail avec le nouveau code OTP
        const sendingMail = await sendEmail(email, verifyCode);
        res.json(otp);
      } else {
        // Créer un nouveau code OTP
        const newOTP = await OTPModel.create({
          email: email,
          verifyCode: verifyCode,
        });

        // Envoyer l'e-mail avec le code OTP
        const sendingMail = await sendEmail(email, verifyCode);
        res.json(newOTP);
      }
    } else {
      // Si l'utilisateur n'existe pas, créer un nouvel utilisateur
      const newUser = await UserModel.create({ email: email });

      // Créer un nouveau code OTP pour cet utilisateur
      const newOTP = await OTPModel.create({
        email: email,
        verifyCode: verifyCode,
      });

      // Envoyer l'e-mail avec le code OTP
      const sendingMail = await sendEmail(email, verifyCode);
      res.json(newOTP);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur est survenue");
  }
};

const verifyCode = async (req, res) => {
  const { code } = req.body;
  const { email } = req.params;

  try {
    const otp = await OTPModel.findOne({ email: email });

    if (otp) {
      console.log(otp.verifyCode);
      console.log(code);
      if (otp.verifyCode === code) {
        const deconsteOTP = await OTPModel.findOne({ email: email });
        if (deconsteOTP) {
          await UserModel.findOneAndUpdate(
            { email: email },
            { $set: { verify: true } },
            { new: true }
          );
          res.status(200).json({ message: "Email confirmé" });
        }
      } else {
        console.log("Code de verification invalide");
      }
    } else {
      console.log("Une erreur est survenue");
    }
  } catch (err) {
    console.log(err);
  }
};
const setPersonalInfo = async (req, res) => {
  const { noms, prenoms, numero, quartier, password } = req.body;

  const { email } = req.params;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          noms: noms,
          prenoms: prenoms,
          numero: numero,
          quartier: quartier,
          password: hashedPassword,
        },
      },
      { new: true }
    );
    if (user) {
      const expireIn = 24 * 60 * 60; // Durée de validité du token en secondes
      const token = jwt.sign({ user: user }, process.env.SECRET_KEY, {
        expiresIn: expireIn,
      });

      // Ajoute le token dans l'en-tête de la réponse
      res.header("Authorization", "Bearer " + token);
      res.status(200).json({
        message: "Inscription terminer",
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const userCheck = async (req, res) => {
  try {
    const id = req.decoded.user._id;

    // Rechercher l'utilisateur par son ID et populer les articles associés
    const user = await UserModel.findById(id);

    // Envoyer la réponse avec l'utilisateur et ses articles
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la recherche de l'utilisateur." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });

    if (user) {
      if (user.verify) {
        const pass = await user.isValidePassword(password);

        if (pass) {
          const expireIn = 24 * 60 * 60; // Durée de validité du token en secondes
          const token = jwt.sign({ user: user }, process.env.SECRET_KEY, {
            expiresIn: expireIn,
          });

          // Ajoute le token dans l'en-tête de la réponse
          res.header("Authorization", "Bearer " + token);
          res.status(200).json({
            user: user,
            token: token,
          });
        } else {
          console.log("Mot de passe invalide");
        }
      } else {
        console.log("Votre email n'est pas verifié");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { setEmail, verifyCode, setPersonalInfo, userCheck, login };
