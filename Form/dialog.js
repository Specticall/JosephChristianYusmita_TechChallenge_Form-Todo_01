import { queryUnique } from "./utils.js";

export class Dialog {
  #element;
  #closeButton;
  constructor(name) {
    this.#element = queryUnique(`[data-dialog=${name}]`, name);

    this.#closeButton = this.#element.querySelector("[data-dialog-collapse]");
    if (!this.#closeButton)
      throw new Error("Missing dialog collapse button! [data-dialog-collapse]");

    this.#closeButton.addEventListener("click", this.close.bind(this));
  }

  show() {
    this.#element.style.opacity = "1";
    this.#element.style.visibility = "visible";
  }

  close() {
    this.#element.style.opacity = "0";
    this.#element.style.visibility = "hidden";
  }
}
