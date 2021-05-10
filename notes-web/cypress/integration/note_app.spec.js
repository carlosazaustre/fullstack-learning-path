import user from "../fixtures/user.json";
import note from "../fixtures/note.json";

describe("Note app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    cy.request("POST", "http://localhost:3001/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("front page can be opened", function () {
    cy.contains("Notes Fullstack App");
    cy.contains(
      "Note app, (c) 2021 - Department of Computer Science, University of Helsinki"
    );
  });

  it("login form can be opened", function () {
    cy.contains("log in").click();
  });

  it("login fails with wrong password", function () {
    cy.contains("log in").click();
    cy.get("#username").type(user.username);
    cy.get("#password").type("wrongpassword");
    cy.get("#login-button").click();

    cy.get(".error")
      .should("contain", "Wrong credentials")
      .and("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "border-style", "solid");

    cy.get("html").should("not.contain", `${user.name} logged-in`);
  });

  it("login succeeds with correct username and password", function () {
    cy.contains("log in").click();
    cy.get("#username").type(user.username);
    cy.get("#password").type(user.password);
    cy.get("#login-button").click();

    cy.get("html").should("contain", `${user.name} logged-in`);
  });

  describe("when user is logged in", function () {
    beforeEach(function () {
      //NB: Cypress recommend us omit the UI for login
      cy.login({ username: user.username, password: user.password });
    });

    it("user can log in", function () {
      cy.contains(`${user.name} logged-in`);
      cy.get("html").should("not.contain", "log in");
    });

    it("user can log out", function () {
      cy.contains("Logout").click();
      cy.contains("log in");
      cy.get("html").should("not.contain", `${user.name} logged-in`);
    });

    it("user can create a new note", function () {
      cy.contains(`${user.name} logged-in`);
      cy.contains("new note").click();
      cy.get("#new-note").type(note.content);
      cy.get("#new-note-button").click();
      cy.contains(note.content);
    });

    describe("and a note exists", function () {
      beforeEach(function () {
        cy.createNote({ content: "another note created", important: false });
      });

      it("can be made important", function () {
        cy.contains("another note created")
          .parent()
          .find("button")
          .as("toggleImportantButton");

        cy.get("@toggleImportantButton")
          .should("contain", "make important")
          .click();
        cy.get("@toggleImportantButton").should(
          "contain",
          "make not important"
        );
      });
    });

    describe("and several notes exist", function () {
      beforeEach(function () {
        cy.createNote({ content: "first note", important: false });
        cy.createNote({ content: "second note", important: false });
        cy.createNote({ content: "third note", important: false });
      });

      it("one of those can be made important", function () {
        cy.contains("second note")
          .parent()
          .find("button")
          .as("toggleImportantButton");

        cy.get("@toggleImportantButton").click();
        cy.get("@toggleImportantButton").should(
          "contain",
          "make not important"
        );
      });
    });
  });
});
