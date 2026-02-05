import {
  currentlyBudgeted,
  negativeRed,
  positiveGreen,
  previouslyBudgeted,
  primaryColors,
} from ".";

const textBlack = "text-black";
const textBlue = primaryColors.blue;
const textCurrentlyBudgeted = `text-${currentlyBudgeted}`;
const textGreen = `text-${positiveGreen}`;
const textPreviouslyBudgeted = `text-${previouslyBudgeted}`;
const textRed = `text-${negativeRed}`;
const textWhite = "text-white";

export {
  textBlack,
  textBlue,
  textCurrentlyBudgeted,
  textGreen,
  textPreviouslyBudgeted,
  textRed,
  textWhite,
};
