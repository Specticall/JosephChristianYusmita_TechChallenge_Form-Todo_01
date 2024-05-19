/**
 * Query a unique element from the DOM. this function will throw an error if there exist more than one element with the given query
 */
export const queryUnique = (query, name) => {
  // Retrieve the select element
  const element = document.querySelectorAll(query);

  if (element.length === 0)
    throw new Error(`Unable to find select component with the name ${name}`);

  // Make sure the given name is unique.
  if (Array.from(element).length > 1)
    throw new Error(
      `There is a duplicate select component with the name "${name}"`
    );

  return element[0];
};
