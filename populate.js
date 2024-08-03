require("dotenv").config();
const connectDB = require("./db/connect");
const Product = require("./models/product");
const productsData = require("./products.json");

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.create(productsData);
    console.log(
      "Database connected successfully and products are added to the database"
    );
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
