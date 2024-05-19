import { Select } from "./select.js";
import { Form } from "./form.js";
import { Todo } from "./todo.js";

const filterFns = {
  all: (task) => task,
  onGoing: (task) => !task.isCompleted,
  completed: (task) => task.isCompleted,
};

const updateTodoCount = (count) => {
  document.querySelector(".label.counter").textContent = count;
};

const toggleDateError = (action) => {
  document.querySelector(".date-form-error-msg").classList[action]("show");
};

const newTaskForm = new Form({
  name: "newTask",
});

const todoList = new Todo({
  name: "todo",
});

new Select({
  name: "todo",
  onSelect: (selected, allElements) => {
    allElements.forEach((el) => el.classList.remove("selected"));
    allElements
      .find((el) => el.dataset.option === selected)
      .classList.add("selected");

    todoList.filter(filterFns[selected]);
  },
});

updateTodoCount(todoList.length);

const submitBtn = document.querySelector(".create-button");
const clearBtn = document.querySelector(".clear-button");
const dateInput = document.querySelector("[data-input-due-date]");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleDateError("remove");
  const values = newTaskForm.submit();
  if (!dateInput.value) {
    toggleDateError("add");
    return;
  }
  if (!values) return;

  todoList.add({ ...values, dueDate: new Date(dateInput.value) });
  updateTodoCount(todoList.length);

  newTaskForm.clearValues();
  dateInput.value = undefined;
});

clearBtn.addEventListener("click", (e) => {
  e.preventDefault();
  newTaskForm.clearValues();
  updateTodoCount(todoList.length);
  toggleDateError("remove");
});
