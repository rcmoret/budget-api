const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      // Capitalize the first letter and add the rest of the word in lowercase
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" "); // Join the words back into a single string
};

export { titleCase };
