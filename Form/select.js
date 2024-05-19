import { queryUnique } from "./utils.js";

export class Select {
  constructor(options) {
    const name = options?.name;
    const onSelect = options?.onSelect;
    const defaultValue = options?.defaultValue;

    // Make sure on select is a function
    if (typeof onSelect !== "function")
      throw new Error("onSelect must be a function!");

    // queries the element, will throw if a duplicate exists
    this.element = queryUnique(`[data-select=${name}]`, name);

    // Set the callback function
    this.onSelect = onSelect;

    // Retrieve option elements
    this.optionElement = Array.from(
      this.element.querySelectorAll(`[data-select-option]`)
    );

    if (this.optionElement.length === 0)
      throw new Error(
        `No option components exist for the select input with the name ${name}}`
      );

    // Handles appending default value
    if (defaultValue) this.appendDefaultValue(defaultValue);

    // Attach listener that listen for clicks
    this.attachListener();
  }

  // Handles appending the default value
  appendDefaultValue(value) {
    // Find the element associated with the default value
    const defaultElement = this.optionElement.find(
      (element) => element.dataset.selectOption === value
    );
    if (!defaultElement)
      throw new Error(`No element associated with the value ${value} exists`);

    // Append the selection
    this.selected = {
      value,
      element: defaultElement,
    };

    // Call the callback function
    if (this.onSelect) this.onSelect(this.selected, this.optionElement);
  }

  attachListener() {
    this.optionElement.forEach((element) => {
      element.addEventListener("click", () => {
        // Change the selected value
        this.selected = {
          value: element.dataset.selectOption,
          element,
        };

        // Call the callback function
        if (this.onSelect) this.onSelect(this.selected, this.optionElement);
      });
    });
  }

  get value() {
    return this.selected.value;
  }
}
