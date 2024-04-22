const express = require("express");
const {
  storeCategory,
  getAllCategory,
  deleteCategory,
  getOneCategory,
  updateCategory,
} = require("../controllers/categoryController");
const {
  getUserCommandes,
  setCommande,
  setPosition,
  getCommandes,
} = require("../controllers/commandeController");

// const {
//   setEmail,
//   verifyCode,
//   setPersonalInfo,
//   userCheck,
//   login,
// } = require("../controllers/userController");
const { checkJWT } = require("../middleweare/security");

const router = express.Router();

router.get("/", checkJWT, getUserCommandes);
router.get("/all", getCommandes);
router.post("/", checkJWT, setCommande);
router.put("/:id", checkJWT, setPosition);

module.exports = router;
