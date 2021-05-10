import React from "react";
import PropTypes from "prop-types";

export const Note = ({ note, toggleImportance }) => {
  const label = note.important ? "make not important" : "make important";
  return (
    <li className="note">
      <span>{note.content}</span>
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};

Note.propTypes = {
  note: PropTypes.shape({
    important: PropTypes.bool.isRequired,
    content: PropTypes.string.isRequired,
  }),
  toggleImportance: PropTypes.func.isRequired,
};
