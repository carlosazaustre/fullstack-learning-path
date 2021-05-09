const notesRouter = require("express").Router();
const Note = require("../models/note.model");

notesRouter.post("/", async (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  try {
    const savedNote = await note.save();
    res.json(savedNote.toJSON());
  } catch (error) {
    next(error);
  }
});

notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({});
  res.json(notes.map((note) => note.toJSON()));
});

notesRouter.get("/:id", async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (note) {
      res.json(note.toJSON());
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

notesRouter.put("/:id", (req, res, next) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then((updatedNote) => res.json(updatedNote.toJSON()))
    .catch((error) => next(error));
});

notesRouter.delete("/:id", async (req, res, next) => {
  try {
    await Note.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = notesRouter;
