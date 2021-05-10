const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("express-async-errors");

const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const notesRouter = require("./controllers/notes.controller");
const usersRouter = require("./controllers/users.controller");
const loginRouter = require("./controllers/login.controller");

const app = express();

logger.info("connecting to", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB: ", error.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/notes", notesRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/test.controller");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
