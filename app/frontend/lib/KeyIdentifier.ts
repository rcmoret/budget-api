const generateKeyIdentifier = () => {
  return [...Array(12)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
}

export { generateKeyIdentifier }
