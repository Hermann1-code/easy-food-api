const express = require("express");

const app = express();

app.use("/auth", require("../routes/authRouter"));
app.use("/category", require("../routes/categoryRouter"));
app.use("/products", require("../routes/productRouter"));
app.use("/cart", require("../routes/cartRouter"));
app.use("/commandes", require("../routes/commandesRouter"));

module.exports = app;
