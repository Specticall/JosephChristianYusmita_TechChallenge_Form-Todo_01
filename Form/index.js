import { Dialog } from "./dialog.js";
import { Form } from "./form.js";
import { Select } from "./select.js";

const submitButton = document.querySelector(".submit-button");
const clearButton = document.querySelector(".clear-button");
const successDialog = new Dialog("success");

const selectInput = new Select({
  name: "plans",
  defaultValue: "One-Time Payment",
  onSelect: (selected, optionElements) => {
    optionElements.forEach((element) => element.classList.remove("selected"));
    selected.element.classList.add("selected");
  },
});

const paymentForm = new Form({
  name: "paymentDetails",
  onSuccess: (value) => {
    // Combine the values from select input and form
    const formValues = { ...value, plan: selectInput.value };

    // Display value to console
    console.log(formValues);

    // Show success modal
    successDialog.show();
  },
});

// Attach submit function to the request payment button
submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  paymentForm.submit();
});

// Attach clear function to the clear button
clearButton.addEventListener("click", (e) => {
  e.preventDefault();
  paymentForm.clearError();
  paymentForm.clearValues();
});
