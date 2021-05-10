import React, { useState } from "react";
import PropTypes from "prop-types";

export const AddNoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState("a new note...");

  const handleChange = (event) => {
    setNewNote(event.target.value);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    createNote({
      content: newNote,
      important: false,
    });

    setNewNote("");
  };

  return (
    <div className="formDiv">
      <h2>Create a new note</h2>

      <form onSubmit={handleOnSubmit}>
        <input type="text" value={newNote} onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

AddNoteForm.propTypes = {
  createNote: PropTypes.func.isRequired,
};
