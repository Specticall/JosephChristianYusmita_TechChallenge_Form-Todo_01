const EMAIL_REGEX = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/;

const validators = {
  // If input is empty (falsy) then this will return false.
  required: {
    validator: (input) => Boolean(input),
    errorMessage: "This field is required",
  },

  // False is regex fails to validate.
  email: {
    validator: (input) => EMAIL_REGEX.test(input),
    errorMessage: "This field must use an email format",
  },

  // Check if string a number
  number: {
    validator: (input) => !isNaN(input) && !isNaN(parseFloat(input)),
    errorMessage: "This field must be a number",
  },

  // Only allows enum
  // e.g. enum:female|male
  enum: {
    validator: (input, detail) => {
      const allowedStrings = detail.split("|");
      return allowedStrings.some(
        (string) => input.toLowerCase() === string.toLowerCase()
      );
    },
    errorMessage: `This field must use the valid format`,
  },
};

/**
 * Form handler logic.
 * 
 *  @example 
 * <form data-form="paymentDetails" class="container">
 * 1. Register your form container with `data-form=<FORM_NAME>`
 *    <div div class="form-input-container">
          <label class="form-label">Gender</label>
          <p data-form-error="gender"></p>
          2. Prepare a form error element using `data-form-error=<FORM_INPUT_NAME>`
          
          <input
            type="text"
            placeholder="Female"
            class="form-input"
            data-form-input="gender"
            data-form-rule="required,enum:male|female"
          />
          3. Register an input with `data-form-input=<FORM_INPUT_NAME>`. Make sure data form error and data form input have the same corresponding name.

          Add form validation using `data-form-rule=<RULE,RULE,RULE...> (List of rules shown below)
      </div>
    </form>

     @example 
    const paymentForm = new Form({
      name: "paymentDetails",
      onSuccess: (value) => {
        // Code...
      },
    });

    Rules
    - `required` : User input is mandatory
    - `email` : User input has to have an email format <EMAIL>@<DOMAIN>.com
    - `number` : Input has be numeric
    - `enum` : Allows only specified input e.g. enum:premium|member will only allow "premium" and "member as input" (case insensitive)
 */
export class Form {
  constructor(options) {
    const name = options?.name;
    const onSuccess = options?.onSuccess;
    const onError = options?.onError;

    this.name = name;
    this.element = document.querySelector(`[data-form="${name}"]`);
    this.onSuccess = onSuccess;
    this.onError = onError;

    // Parse the form fields and retrieve the selected rules.
    this.formFields = this.parseFormFields();

    // Prevent any buttons in the form from causing a submit.
    this.element.querySelectorAll("button")?.forEach((button) => {
      button.addEventListener("click", (e) => e.preventDefault());
    });
  }

  get allFormInputs() {
    return this.element.querySelectorAll("[data-form-input]");
  }

  parseRules(rulesQuery) {
    const rules = rulesQuery?.split(",");
    return rules || [];
  }

  parseFormFields() {
    // Convert node list to array
    const inputArray = Array.from(this.allFormInputs);

    // Convert to the element array into object
    const parsedInputs = inputArray.reduce((parsed, input) => {
      parsed.push({
        name: input.dataset.formInput,
        element: input,
        rules: this.parseRules(input.dataset.formRule),
      });
      return parsed;
    }, []);

    return parsedInputs;
  }

  validate(rulesArray, value) {
    // Every element in the array must validate to true when they get run through the validator
    const validatedFields = rulesArray.map((rule) => {
      // Anticipate rules in which the format contains details e.g. enum:test1|test2, min:20, max:50
      const ruleName = rule.split(":")[0];
      const ruleDetail = rule.split(":")[1];

      const validator = validators[ruleName]?.validator;

      if (!validator) throw new Error(`The rule: ${rule}, does not exist!`);

      // Runs the corresponding validator, if false then return the error message, else return true
      // If the rule does not have detail (required, number, etc...) the second argument will be ignored
      return validator(value, ruleDetail)
        ? "valid"
        : validators[ruleName].errorMessage;
    });

    return {
      status: validatedFields.every((field) => field === "valid")
        ? "success"
        : "error",
      errorMessage: validatedFields.filter((field) => field !== "valid"),
    };
  }

  clearError() {
    const errorElements = this.element.querySelectorAll("[data-form-error]");
    errorElements.forEach((element) => (element.textContent = ""));
  }

  displayError(errorMessage, fieldName) {
    const errorElement = this.element.querySelector(
      `[data-form-error=${fieldName}]`
    );
    if (!errorElement) return;
    errorElement.textContent = errorMessage;
  }

  submit() {
    // Flag to know if the form encounters a validation error or not. (If yes then function will return)
    let hasErrored = false;

    // Clear any errors displayed in the html
    this.clearError();

    // Retrieve the validated form values.
    const submitValue = this.formFields.reduce((value, field) => {
      const fieldValue = field.element.value;

      const validation = this.validate(field.rules, fieldValue);

      // If validation is successful then append the field value
      if (validation.status === "success") {
        value[field.name] = field.element.value;
      } else {
        // If not then trigger the error flag and show the message.
        hasErrored = true;
        value[field.name] = validation.errorMessage;
        this.displayError(validation.errorMessage[0], field.name);
      }

      return value;
    }, {});

    // Call the callback functions (if they exist)
    if (hasErrored) {
      if (this.onError) this.onError(submitValue);
      return;
    }

    if (this.onSuccess) this.onSuccess(submitValue);
  }

  // Clear the form values
  clearValues() {
    this.formFields.forEach((field) => {
      field.element.value = "";
    });
  }
}
