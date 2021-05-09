import React, { useState } from "react";

export const AddNoteForm = ({ onAddNote }) => {
  const [newNote, setNewNote] = useState("a new note...");

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const noteObject = {
      content: newNote,
      important: false,
    };

    setNewNote("");
    onAddNote(noteObject);
  };

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={handleOnSubmit}>
        <input type="text" value={newNote} onChange={handleNoteChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};
