import { useContext, useState } from "react";

import { TodoContext } from "../context/TodoContext";

import AddTodo from "./AddTodo";
import TodosFooter from "./TodosFooter";
import TodosHeader from "./TodosHeader";
import TodoItem from "./TodoItem";

export interface TodoItemType {
  id: string;
  title: string;
  completed: boolean;
}

type TodoFilter = "all" | "active" | "completed";

export default function TodosList() {
  const { todoItems } = useContext(TodoContext);
  const [filter, setFilter] = useState<TodoFilter>("all");

  const visibleTodos = todoItems.filter((todoItem) => {
    if (filter === "active") return !todoItem.completed;
    if (filter === "completed") return todoItem.completed;
    return true;
  });

  const filters: { value: TodoFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  const emptyMessage =
    todoItems.length === 0
      ? "You're all caught up!"
      : filter === "active"
        ? "No active tasks."
        : filter === "completed"
          ? "No completed tasks."
          : "You're all caught up!";

  return (
    <div className="ui-panel flex flex-col overflow-hidden">
      <TodosHeader />
      <AddTodo />

      <div className="mx-4 my-5 h-96 overflow-auto md:mx-6 md:my-6 lg:mx-8 lg:my-7 lg:h-[32rem] md:h-[28rem]">
        <div className="sticky top-0 z-10 mb-3 flex flex-wrap gap-2 bg-[var(--ui-surface)] py-2" role="group" aria-label="Filter tasks">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                filter === value ? "ui-button-primary" : "ui-divider ui-text-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <ul className="mt-3" data-testid="todos-list">
          {todoItems.map((todoItem) => (
            <TodoItem
              key={todoItem.id}
              todo={todoItem}
              hidden={
                filter === "active"
                  ? todoItem.completed
                  : filter === "completed"
                    ? !todoItem.completed
                    : false
              }
            />
          ))}
        </ul>

        {visibleTodos.length === 0 && (
          <p
            className="ui-text-muted mx-auto my-16 max-w-xs text-center text-base leading-7 sm:text-lg"
            data-testid="empty-todos-message"
            role="status"
            aria-live="polite"
          >
            {emptyMessage}
          </p>
        )}
      </div>

      <TodosFooter
        totalTasks={todoItems.length}
        doneTasks={todoItems.filter((todoItem) => todoItem.completed).length}
      />
    </div>
  );
}
