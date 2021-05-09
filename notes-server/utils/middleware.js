const requestLogger = (req, res, next) => {
  console.log("Method: ", req?.method);
  console.log("Path: ", req?.path);
  console.log("Body: ", req?.body);
  console.log("----");
  next();
};

const errorHandler = (error, req, res, next) => {
  console.log(error);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

module.exports = { requestLogger, errorHandler, unknownEndpoint };
