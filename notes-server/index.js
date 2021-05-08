require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Note = require("./models/note");

const PORT = process.env.PORT;
const URL = process.env.MONGODB_URI;
const app = express();
const server = http.createServer(app);

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
});

const requestLogger = (req, res, next) => {
  console.log("Method: ", req?.method);
  console.log("Path: ", req?.path);
  console.log("Body: ", req?.body);
  console.log("----");
  next();
};

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use(requestLogger);

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => res.json(notes));
});

app.get("/api/notes/:id", (req, res) => {
  Note.findById(req.params.id).then((note) => res.json(note));
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content || body.content === undefined) {
    return res.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => res.json(savedNote));
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);

  res.status(204).end();
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
