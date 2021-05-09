const notesRouter = require("express").Router();
const Note = require("../models/note.model");
const User = require("../models/user.model");

notesRouter.post("/", async (req, res) => {
  const body = req.body;
  const user = await User.findById(body.userId);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = [...user.notes, savedNote._id];
  await user.save();

  res.json(savedNote.toJSON());
});

notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({});
  res.json(notes.map((note) => note.toJSON()));
});

notesRouter.get("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note) {
    res.json(note.toJSON());
  } else {
    res.status(404).end();
  }
});

notesRouter.put("/:id", async (req, res) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, note, {
    new: true,
  });
  res.json(updatedNote.toJSON());
});

notesRouter.delete("/:id", async (req, res) => {
  await Note.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = notesRouter;
