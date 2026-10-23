import { fireEvent, render, screen, within } from "@testing-library/react";

import { initialState, TodoContext } from "../context/TodoContext";
import TodosList from "./TodosList";

describe("TodosList filters", () => {
  const todoItems = [
    { id: "1", title: "Write report", completed: false },
    { id: "2", title: "Review pull request", completed: true },
  ];

  function renderTodos() {
    return render(
      <TodoContext.Provider value={{ ...initialState, todoItems }}>
        <TodosList />
      </TodoContext.Provider>,
    );
  }

  test("shows all tasks by default", () => {
    renderTodos();

    const list = screen.getByTestId("todos-list");
    expect(within(list).getByText("Write report")).toBeInTheDocument();
    expect(within(list).getByText("Review pull request")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("shows only active tasks when Active is selected", () => {
    renderTodos();

    fireEvent.click(screen.getByRole("button", { name: "Active" }));

    const list = screen.getByTestId("todos-list");
    expect(within(list).getByText("Write report")).toBeInTheDocument();
    expect(within(list).queryByText("Review pull request")).not.toBeInTheDocument();
  });

  test("shows only completed tasks when Completed is selected", () => {
    renderTodos();

    fireEvent.click(screen.getByRole("button", { name: "Completed" }));

    const list = screen.getByTestId("todos-list");
    expect(within(list).getByText("Review pull request")).toBeInTheDocument();
    expect(within(list).queryByText("Write report")).not.toBeInTheDocument();
  });

  test("shows a helpful message when the selected filter has no matches", () => {
    render(
      <TodoContext.Provider
        value={{
          ...initialState,
          todoItems: [{ id: "1", title: "Finished task", completed: true }],
        }}
      >
        <TodosList />
      </TodoContext.Provider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Active" }));

    expect(screen.getByTestId("empty-todos-message")).toHaveTextContent(
      "No active tasks.",
    );
  });
});
