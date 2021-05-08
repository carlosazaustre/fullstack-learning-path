import React from "react";

export const Footer = () => {
  const style = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16,
  };

  return (
    <div style={style}>
      <br />
      <em>
        Note app, (c) 2021 - Department of Computer Science, University of
        Helsinki
      </em>
    </div>
  );
};
