import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";

import { Note } from "./Note";

describe("<Note />", () => {
  let component;

  const mockHandler = jest.fn();
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  beforeEach(() => {
    component = render(<Note note={note} toggleImportance={mockHandler} />);
  });

  test("render content", () => {
    expect(component.container).toHaveTextContent(note.content);
  });

  test("clicking the button calls event handler once", () => {
    const button = component.getByText("make not important");
    fireEvent.click(button);

    expect(mockHandler.mock.calls).toHaveLength(1);
  });
});
