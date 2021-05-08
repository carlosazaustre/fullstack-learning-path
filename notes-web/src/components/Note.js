import React from "react";

export const Note = ({ note, toggleImportance }) => {
  const label = note.imporant ? "make not important" : "make important";
  return (
    <li>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};
