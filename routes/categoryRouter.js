const express = require("express");
const {
  storeCategory,
  getAllCategory,
  deleteCategory,
  getOneCategory,
  updateCategory,
  getCategoryProduct,
} = require("../controllers/categoryController");

// const {
//   setEmail,
//   verifyCode,
//   setPersonalInfo,
//   userCheck,
//   login,
// } = require("../controllers/userController");
// const { checkJWT } = require("../middleweare/security");

const router = express.Router();

router.post("/", storeCategory);
router.get("/", getAllCategory);
router.delete("/:id", deleteCategory);
router.get("/:id", getOneCategory);
router.put("/:id", updateCategory);
router.get("/products/:id", getCategoryProduct);

module.exports = router;
