if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const http = require("http");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Note = require("./models/note");

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);

const logger = (req, res, next) => {
  console.log("Method: ", req?.method);
  console.log("Path: ", req?.path);
  console.log("Body: ", req?.body);
  console.log("----");
  next();
};

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(logger);

app.get("/api/notes", (req, res, next) => {
  Note.find({})
    .then((notes) => res.json(notes.map((note) => note.toJSON())))
    .catch((error) => next(error));
});

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) res.json(note.toJSON());
      else res.status(404).end();
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note
    .save()
    .then((savedNote) => res.json(savedNote.toJSON()))
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (req, res, next) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then((updatedNote) => res.json(updatedNote.toJSON()))
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

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

app.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
