import js from "@eslint/js";

export default [
    js.configs.recommended,

   {
       parser: "babel-eslint",
       parserOptions: {
           project: "./tsconfig.json",
       },
       rules: {
           "no-unused-vars": "warn",
           "no-undef": "warn"
       }
   }
];
