import React from "react";
import PropTypes from "prop-types";

export const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

Notification.propTypes = {
  message: PropTypes.string,
};
