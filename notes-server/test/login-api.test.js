const supertest = require("supertest");
const mongoose = require("mongoose");
const helper = require("./helper");
const app = require("../app");

const api = supertest(app);
const User = require("../models/user.model");

describe("when a user is login they receive a token", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const { username, name, password } = helper.initialUsers[0];
    await api.post("/api/users").send({ username, name, password });
  });

  test("login succeeds returns a JWT", async () => {
    const { username, password } = helper.initialUsers[0];

    const result = await api
      .post("/api/login")
      .send({ username, password })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(result.body.token).toBeTruthy();
  });

  test("login fails without return a JWT", async () => {
    const result = await api
      .post("/api/login")
      .send({ username: "nonexists", password: "none" })
      .expect(401)
      .expect("Content-Type", /application\/json/);

    expect(result.body.token).toBeFalsy();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
