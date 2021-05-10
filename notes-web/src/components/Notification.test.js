import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";

import { Notification } from "./Notification";

describe("<Notification />", () => {
  test("render with message", () => {
    const component = render(<Notification message="test error" />);
    expect(component.container.querySelector(".error")).toBeDefined();
    expect(component.container).toHaveTextContent("test error");
  });

  test("not render without message", () => {
    const component = render(<Notification />);
    expect(component.container).not.toHaveTextContent("test error");
    expect(component.container).not.toHaveClass("error");
  });
});
