const errorHandler = (req, res) => {
  return res.status(500).send(`Something went wrong`);
};

module.exports = errorHandler;
