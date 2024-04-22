const express = require("express");
const {
  storeProduct,
  getAllProdut,
  deleteProduct,
  getOneProduct,
  updateProduct,
} = require("../controllers/productController");

// const {
//   setEmail,
//   verifyCode,
//   setPersonalInfo,
//   userCheck,
//   login,
// } = require("../controllers/userController");
// const { checkJWT } = require("../middleweare/security");

const router = express.Router();

router.post("/", storeProduct);
router.get("/", getAllProdut);
router.delete("/:id", deleteProduct);
router.get("/:id", getOneProduct);
router.put("/:id", updateProduct);

module.exports = router;
