const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./helper");
const app = require("../app");

const api = supertest(app);
const Note = require("../models/note.model");
const User = require("../models/user.model");

beforeEach(async () => {
  await Note.deleteMany({});
  await User.deleteMany({});

  const noteObjects = helper.initialNotes.map((note) => new Note(note));
  const promiseArray = noteObjects.map((note) => note.save());
  await Promise.all(promiseArray);

  const { username, name, password } = helper.initialUsers[0];
  await api.post("/api/users").send({ username, name, password });
});

describe("when there is initially some notes saved", () => {
  test("notes are returned as JSON", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");
    expect(response.body).toHaveLength(helper.initialNotes.length);
  });

  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");
    const contents = response.body.map((r) => r.content);
    expect(contents).toContain("Browser can execute only Javascript");
  });
});

describe("viewing a specific note", () => {
  test("succeeds with a valid id", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToView = notesAtStart[0];
    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView));
    expect(resultNote.body).toEqual(processedNoteToView);
  });

  test("fails with statuscode 404 if note does not exist", async () => {
    const validNonexistingId = await helper.nonExistingId();
    await api.get(`/api/notes/${validNonexistingId}`).expect(404);
  });

  test("fails with statuscode 400 id is invalid", async () => {
    const invalidId = "5a3d5da59070081a82a3445";
    await api.get(`/api/notes/${invalidId}`).expect(400);
  });
});

describe("addition of a new note", () => {
  test("succeeds with valid data", async () => {
    const newNote = {
      content: "async/await simplifies making async calls",
      important: true,
    };
    const { username, password } = helper.initialUsers[0];

    const result = await api
      .post("/api/login")
      .send({ username, password })
      .expect(200);

    await api
      .post("/api/notes")
      .set("Authorization", `Bearer ${result.body.token}`)
      .send(newNote)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1);

    const contents = notesAtEnd.map((n) => n.content);
    expect(contents).toContain(newNote.content);
  });

  test("fails without authorization header", async () => {
    const newNote = {
      content: "correct note but withour auth",
      important: true,
    };

    await api
      .post("/api/notes")
      .send(newNote)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);

    const contents = notesAtEnd.map((n) => n.content);
    expect(contents).not.toContain(newNote.content);
  });

  test("fails with status code 400 if data invalid and auth", async () => {
    const newNote = { important: true };
    const { username, password } = helper.initialUsers[0];

    const result = await api
      .post("/api/login")
      .send({ username, password })
      .expect(200);

    await api
      .post("/api/notes")
      .set("Authorization", `Bearer ${result.body.token}`)
      .send(newNote)
      .expect(400);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length);
  });
});

describe("deletion of a note", () => {
  test("succeeds with statuscode 204 if id is valid", async () => {
    const notesAtStart = await helper.notesInDb();
    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const notesAtEnd = await helper.notesInDb();
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length - 1);

    const contents = notesAtEnd.map((r) => r.contents);
    expect(contents).not.toContain(noteToDelete.content);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
