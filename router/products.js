const express = require("express");
const router = express.Router();
const { getProducts, getStaticProducts } = require("../controllers/products");

router.route("/").get(getProducts);
router.route("/static").get(getStaticProducts);

module.exports = router;
