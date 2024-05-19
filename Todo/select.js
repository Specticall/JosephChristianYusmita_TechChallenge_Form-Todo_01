export class Select {
  constructor({ name, onSelect }) {
    this.container = document.querySelector(`[data-select-container="${name}"`);

    this.optionList = Array.from(
      this.container.querySelectorAll(`[data-option]`)
    );

    this.onSelect = onSelect;

    this.value = this.optionList[0].dataset.option;

    this.attachListener();
  }

  attachListener() {
    this.optionList.forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        this.value = option.dataset.option;
        this.onSelect(this.value, this.optionList);
      });
    });
  }
}
