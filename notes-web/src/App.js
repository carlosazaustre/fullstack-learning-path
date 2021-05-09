import React, { useState, useEffect } from "react";
import noteService from "./services/noteService";
import loginService from "./services/loginService";
import { Togglable } from "./components/Togglable";
import { AddNoteForm } from "./components/AddNoteForm";
import { LoginForm } from "./components/LoginForm";
import { Note } from "./components/Note";
import { Notification } from "./components/Notification";
import { Footer } from "./components/Footer";

export const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("notes-app-user");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const handleError = (error) => {
    setErrorMessage("Wrong credentials");
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("notes-app-user", JSON.stringify(user));

      noteService.setToken(user.token);
      setUser(user);
    } catch (error) {
      handleError(error);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("notes-app-user");
    setUser(null);
  };

  const handleAddNote = async (noteObject) => {
    try {
      const returnedNote = await noteService.create(noteObject);
      setNotes([...notes, returnedNote]);
    } catch (error) {
      handleError(error);
    }
  };

  const toggleImportanceOf = async (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    try {
      const returnedNote = await noteService.update(id, changedNote);
      setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
    } catch (error) {
      handleError(`Note '${note.content}' was already deleted from server`);
    }
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes Fullstack App</h1>
      <Notification message={errorMessage} />

      {user === null ? (
        <Togglable buttonLabel="log in">
          <LoginForm onLogin={handleLogin} onError={handleError} />
        </Togglable>
      ) : (
        <div>
          <p>
            {user.name} logged-in
            <button onClick={handleLogout}>Logout</button>
          </p>

          <Togglable buttonLabel="new note">
            <AddNoteForm onAddNote={handleAddNote} />
          </Togglable>
        </div>
      )}

      <h2>Notes</h2>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <Footer />
    </div>
  );
};
