const Product = require("../models/product");

const getProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (numericFilters) {
    const operatorMap = {
      "=": "$e",
      ">": "$gt",
      "<": "$lt",
      ">=": "$gte",
      "<=": "$lte",
    };

    const regex = /\b(<|>|<=|>=|=)\b/g;
    const filters = numericFilters.replace(
      regex,
      (match) => `-${operatorMap[match]}-`
    );

    const numberFields = ["price", "rating"];
    filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (numberFields.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  console.log(queryObject);

  //queryObject
  let result = Product.find(queryObject);

  //sorting
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result.sort(sortList);
  } else {
    result.sort("createdAt");
  }

  //fields
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result.select(fieldsList);
  }

  //pagination (skip and limit)
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.limit(limit).skip(skip);

  const products = await result;
  res.status(200).json({ nbHits: products.length, products });
};

const getStaticProducts = async (req, res) => {
  const products = await Product.find({ price: { $gt: 30 } })
    .sort("price")
    .select("name price");

  res.status(200).json({ nbHits: products.length, products });
};

module.exports = { getProducts, getStaticProducts };
