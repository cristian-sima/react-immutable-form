import { TranslationMap, Words } from "../types";
import romanianWords from "./ro";

let 
  words = {
    "CONFIRMATION_FORM_LEAVE" : "If you leave this page, your changes to the form will be lost. Are you sure you want to leave this page?",
    "SOMETHING_WENT_WRONG"    : "Something went wrong. Please try again in a few minutes",
    "CHECK_THE_ERRORS"        : "Please check the following errors:",
    "TO_HIDE_CLICK_HERE"      : "To hide this, click here",
    "ROW"                     : "Row",
    "PLEASE_SELECT_OPTION"    : "Select",
    "FIELDS_TO_DESCRIPTIONS"  : {} as TranslationMap,
  };

const 
  setCustomLanguage = ((newWords : Words) => {
    words = {
      ...words,
      ...newWords,
    };
  }),
  getWords = () => words,
  language = {
    setCustomLanguage,
    getWords,
    customLanguage: {
      romanianWords,
    },
  };

export default language;
