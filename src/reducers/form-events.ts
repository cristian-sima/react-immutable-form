/* eslint-disable new-cap */

import Immutable from "immutable";
import { ImmutableFormState } from "../types";
import { FormSetDerivedState, FormSetIsSubmitting } from "../types-actions";
import { verifyAllItems } from "./form-events-util";

export const 

  /** @intern */
  handleFormOnSubmit = (formData : ImmutableFormState) => {
    const 
      validationResult = verifyAllItems({
        formState  : formData.get("state"),
        management : formData.get("management"),
        validators : formData.get("validators"),
      });
      
    return formData
      .set("state", validationResult.newFormState)
      .mergeIn(["management"], Immutable.Map({
        "readyToSubmit" : true,
        "values"        : validationResult.values,
        "errors"        : validationResult.errors,
      }));
  },

  /** @intern */
  handleFormSubmitHandled = (formData : ImmutableFormState) => (
    formData
      .mergeIn(["management"], Immutable.Map({
        "formError"     : undefined,
        "readyToSubmit" : false,
        "values"        : undefined,
        "errors"        : undefined,
      }))
  ),

  /** @intern */
  setFormIsSubmitting = (formData : ImmutableFormState, action : FormSetIsSubmitting) => (
    formData
      .mergeIn(["management"], Immutable.Map({
        "isSubmitting" : action.payload.isSubmitting,
        "formError"    : action.payload.error || undefined,
      }))
  ),

  /** @intern */
  setFormDerivedState = (formData : ImmutableFormState, action : FormSetDerivedState) => (
    formData
      .mergeIn(["derived"], action.payload)
  );