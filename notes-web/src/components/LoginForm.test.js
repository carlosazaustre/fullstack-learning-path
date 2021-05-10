import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";

import { LoginForm } from "./LoginForm";

describe("<LoginForm />", () => {
  it("test", () => {
    const onLogin = jest.fn();

    const component = render(<LoginForm onLogin={onLogin} />);
    const inputUsername = component.container.querySelector("#username");
    const inputPassword = component.container.querySelector("#password");
    const form = component.container.querySelector("form");
    fireEvent.change(inputUsername, { target: { value: "username" } });
    fireEvent.change(inputPassword, { target: { value: "password" } });
    fireEvent.submit(form);

    expect(onLogin.mock.calls).toHaveLength(1);
    expect(onLogin.mock.calls[0][0].username).toBe("username");
    expect(onLogin.mock.calls[0][0].password).toBe("password");
  });
});
