import {
  currentlyBudgeted,
  negativeRed,
  neutralColors,
  positiveGreen,
  previouslyBudgeted,
  primaryColors,
} from ".";

const textBlack = "text-black";
const textBlue = `text-${primaryColors.blue}`;
const textCharcoal = `text-${neutralColors.darker}`;
const textCurrentlyBudgeted = `text-${currentlyBudgeted}`;
const textGreen = `text-${positiveGreen}`;
const textPreviouslyBudgeted = `text-${previouslyBudgeted}`;
const textRed = `text-${negativeRed}`;
const textWhite = "text-white";

export {
  textBlack,
  textBlue,
  textCharcoal,
  textCurrentlyBudgeted,
  textGreen,
  textPreviouslyBudgeted,
  textRed,
  textWhite,
};
