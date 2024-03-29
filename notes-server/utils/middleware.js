const logger = require("./logger");

const requestLogger = (req, res, next) => {
  logger.info("Method: ", req?.method);
  logger.info("Path: ", req?.path);
  logger.info("Body: ", req?.body);
  logger.info("----");
  next();
};

const errorHandler = (error, req, res, next) => {
  logger.info(error);

  if (error.name === "CastError") {
    return res.status(400).send({
      error: "malformatted id",
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: error.message,
    });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "invalid token",
    });
  }

  next(error);
};

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: "unknown endpoint" });
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

module.exports = {
  requestLogger,
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
};
