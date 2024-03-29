import React, { useState } from "react";
import PropTypes from "prop-types";

export const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleOnSubmit = (event) => {
    event.preventDefault();

    onLogin({ username, password });

    setUsername("");
    setPassword("");
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleOnSubmit}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};
