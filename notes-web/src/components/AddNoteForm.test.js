import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";

import { AddNoteForm } from "./AddNoteForm";

describe("<AddNoteForm />", () => {
  test("updates parent state and calls onSubmit", () => {
    const createNote = jest.fn();

    const component = render(<AddNoteForm createNote={createNote} />);
    const input = component.container.querySelector("input");
    const form = component.container.querySelector("form");

    fireEvent.change(input, {
      target: { value: "form testing should be easier" },
    });
    fireEvent.submit(form);

    expect(createNote.mock.calls).toHaveLength(1);
    expect(createNote.mock.calls[0][0].content).toBe(
      "form testing should be easier"
    );
  });
});
