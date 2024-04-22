const express = require("express");

const {
  setEmail,
  verifyCode,
  setPersonalInfo,
  userCheck,
  login,
} = require("../controllers/userController");
const { checkJWT } = require("../middleweare/security");

const router = express.Router();

router.post("/addNumber", setEmail);
router.post("/verifyCode/:email", verifyCode);
router.post("/setPersonnalInfo/:email", setPersonalInfo);
router.post("/login", login);
router.get("/user", checkJWT, userCheck);
module.exports = router;
