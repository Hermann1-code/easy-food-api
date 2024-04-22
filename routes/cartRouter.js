const express = require("express");

const { addToCart, getCart, desQty } = require("../controllers/cartController");
const { checkJWT } = require("../middleweare/security");

const router = express.Router();

router.post("/addTocart/:productId", checkJWT, addToCart);
router.post("/desQty/:productId", checkJWT, desQty);
router.get("/", checkJWT, getCart);

module.exports = router;
