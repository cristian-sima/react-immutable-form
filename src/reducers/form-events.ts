/* eslint-disable new-cap */

import Immutable from "immutable";
import { ImmutableFormState } from "../types";
import { FormSetIsSubmitting } from "../types-actions";
import { verifyAllItems } from "./util-verify";


export const 
  handleFormOnSubmit = (formData : ImmutableFormState) => {
    const 
      validationResult = verifyAllItems({
        formState  : formData.get("state"),
        management : formData.get("management"),
        validators : formData.get("validators"),
      });
      
    return formData
      .set("state", validationResult.newFormState)
      .mergeDeepIn(["management"], Immutable.Map({
        "readyToSubmit" : true,
        "values"        : validationResult.values,
        "errors"        : validationResult.errors,
      }));
  },
  handleFormSubmitHandled = (formData : ImmutableFormState) => (
    formData
      .mergeDeepIn(["management"], Immutable.Map({
        "formError"     : undefined,
        "readyToSubmit" : false,
        "values"        : undefined,
        "errors"        : undefined,
      }))
  ),
  setFormIsSubmitting = (formData : ImmutableFormState, action : FormSetIsSubmitting) => (
    formData
      .mergeDeepIn(["management"], Immutable.Map({
        "isSubmitting" : action.payload.isSubmitting,
        "formError"    : action.payload.error || undefined,
      }))
  );