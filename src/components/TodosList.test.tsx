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
    expect(within(list).getByText("Write report")).toBeVisible();
    expect(within(list).getByText("Review pull request")).toBeVisible();
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
  });

  test("hides completed tasks when Active is selected", () => {
    renderTodos();
    fireEvent.click(screen.getByRole("button", { name: "Active" }));
    const list = screen.getByTestId("todos-list");
    expect(within(list).getByText("Write report")).toBeVisible();
    expect(within(list).getByText("Review pull request").closest("li")).not.toBeVisible();
  });

  test("hides active tasks when Completed is selected", () => {
    renderTodos();
    fireEvent.click(screen.getByRole("button", { name: "Completed" }));
    const list = screen.getByTestId("todos-list");
    expect(within(list).getByText("Review pull request")).toBeVisible();
    expect(within(list).getByText("Write report").closest("li")).not.toBeVisible();
  });

  test("preserves an in-progress edit when its task is filtered out", () => {
    renderTodos();
    fireEvent.click(within(screen.getByTestId("todos-list")).getAllByRole("button", { name: "Edit todo" })[0]);
    const editInput = screen.getByRole("textbox", { name: "Edit todo title" });
    fireEvent.change(editInput, { target: { value: "Updated report title" } });

    fireEvent.click(screen.getByRole("button", { name: "Completed" }));

    expect(screen.getByRole("textbox", { name: "Edit todo title" })).toHaveValue("Updated report title");
    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByRole("textbox", { name: "Edit todo title" })).toHaveValue("Updated report title");
  });

  test("announces when the selected filter has no matches", () => {
    render(
      <TodoContext.Provider value={{ ...initialState, todoItems: [{ id: "1", title: "Finished task", completed: true }] }}>
        <TodosList />
      </TodoContext.Provider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Active" }));
    expect(screen.getByRole("status")).toHaveTextContent("No active tasks.");
  });
});
