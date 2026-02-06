import {
  currentlyBudgeted,
  mutedColors,
  negativeRed,
  neutralColors,
  positiveGreen,
  previouslyBudgeted,
  primaryColors,
} from ".";

const bgBlack = "bg-black";
const bgBlue = `bg-${primaryColors.blue}`;
const bgCharcoal = `bg-${neutralColors.darker}`;
const bgChareuese = `bg-${primaryColors.charteuese}`;
const bgChareueseMuted = `bg-${mutedColors.charteuese}`;
const bgCurrentlyBudgeted = `bg-${currentlyBudgeted}`;
const bgGreen = `bg-${positiveGreen}`;
const bgPreviouslyBudgeted = `bg-${previouslyBudgeted}`;
const bgRed = `bg-${negativeRed}`;
const bgWhite = "bg-white";

export {
  bgBlack,
  bgBlue,
  bgCharcoal,
  bgChareuese,
  bgChareuese as bgDeposited,
  bgChareueseMuted,
  bgCurrentlyBudgeted,
  bgGreen,
  bgPreviouslyBudgeted,
  bgRed as bgSpent,
  bgRed,
  bgWhite,
};
