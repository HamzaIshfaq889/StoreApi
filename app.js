require("dotenv").config();
const express = require("express");
const app = express();
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");
const productRouter = require("./router/products");
const connectDB = require("./db/connect");
const port = 5000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", productRouter);
app.get("/", (req, res) => {
  res.status(200).send(`
  <h1> Welcome to the store api </h1>
  <p> End point for getting products is /api/v1/ </p> 
  <p> Can perform filtering based on name,company,featured </p>
  <p> Can perform numeric filtering based on price and rating</p>
  <p> Can perform pagination and sorting </p>  
  `);
});

app.use(notFound);
app.use(errorHandler);

const start = () => {
  try {
    connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
