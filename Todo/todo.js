import { formatDate } from "./utils.js";

const dummyTask = [
  {
    title: "Build complex UI components",
    content:
      "Would be good if we include every component in the design system.",
    dueDate: new Date(2024, 5, 20),
    id: Math.random().toString(),
    isCompleted: false,
  },
  {
    title: "Optimize backend performance",
    content: "Review and improve database queries for faster response times.",
    dueDate: new Date(2024, 6, 15),
    id: Math.random().toString(),
    isCompleted: false,
  },

  {
    title: "Set up CI/CD pipeline",
    content: "Automate testing and deployment processes for the project.",
    dueDate: new Date(2024, 6, 12),
    id: Math.random().toString(),
    isCompleted: false,
  },
];

const taskTemplate = ({ id, dueDate, title, content, isCompleted }) => {
  return `
    <li data-todo-task="${id}" class="${isCompleted ? "task-completed" : ""}">
      <div class="checkbox" data-checkbox="${id}"></div>
      <div class="heading">
      <h3>${title}</h3>
      <i class="bx bx-trash" data-delete="${id}"></i>
      </div>
        <p>${content}</p>
      <div class="due-date">
        <i class="bx bx-calendar"></i>
        ${formatDate(dueDate)}
      </div>
    </li>
  `;
};

const emptyTaskTemplate = () => {
  return `
    <p class="empty-task">No Tasks Found</p>
  `;
};

export class Todo {
  constructor({ name }) {
    this.container = document.querySelector(`[data-todo-container="${name}"]`);
    this.taskList = dummyTask;
    this.filterFn = (item) => item;

    this.render();
  }

  render() {
    this.container.innerHTML = "";

    const filteredTaskList = this.taskList.filter(this.filterFn);

    if (filteredTaskList.length === 0) {
      this.container.insertAdjacentHTML("afterbegin", emptyTaskTemplate());
      return;
    }

    filteredTaskList.forEach((task) => {
      this.container.insertAdjacentHTML(
        "beforeend",
        taskTemplate({
          dueDate: task.dueDate,
          title: task.title,
          content: task.content,
          id: task.id,
          isCompleted: task.isCompleted,
        })
      );

      const deleteEl = document.querySelector(`[data-delete="${task.id}"]`);
      const element = document.querySelector(`[data-todo-task="${task.id}"]`);
      deleteEl.addEventListener("click", this.handleDelete(task.id).bind(this));
      element.addEventListener(
        "click",
        this.handleToggleStatus(task.id).bind(this)
      );
    });
  }

  generateId() {
    return `${Math.random()}`;
  }

  add({ title, content, dueDate }) {
    if (!title || !content || !dueDate) {
      throw new Error("Todo.add() : Some task fields are missing");
    }
    const id = this.generateId();
    this.taskList.push({
      dueDate,
      title,
      content,
      id,
      isCompleted: false,
    });

    this.render();
  }

  handleDelete(id) {
    return (e) => {
      e.preventDefault();
      this.delete(id);
    };
  }

  handleToggleStatus(id) {
    return (e) => {
      if (e.target.closest("[data-delete]")) return;

      this.toggleStatus(id);
    };
  }

  toggleStatus(id) {
    const task = this.taskList.find((task) => task.id === id);
    if (!task) throw new Error(`Task with the id ${id} is not found`);
    task.isCompleted = !task.isCompleted;

    this.render();
  }

  delete(id) {
    this.taskList = this.taskList.filter((task) => task.id !== id);
    this.render();
  }

  filter(filterFn) {
    this.filterFn = filterFn;
    this.render();
  }

  get length() {
    return this.taskList.length;
  }
}
