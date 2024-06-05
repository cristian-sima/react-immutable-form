/* eslint-disable new-cap */

import Immutable from "immutable";
import { FormOptions } from "../types";
import { ImmutableFormActions } from "../types-actions";
import { getDefaultManagement, parseInitialData } from "../util";
import { handleArrayAddAction, handleArrayRemoveAction } from "./array";
import { handleOnBlur } from "./field-onBlur";
import { handleOnChange } from "./field-onChange";
import { handleOnFocus } from "./field-onFocus";
import { handleRegisterField } from "./field-register";
import { handleUnregisterField } from "./field-unRegister";
import { handleFormOnSubmit, handleFormSubmitHandled, setFormIsSubmitting } from "./form-events";

export const 
  reducer = (state : Immutable.Map<string, any> = Immutable.Map(), action : ImmutableFormActions) => {

    switch (action.type) {
      case "field-event-onFocus":
        return handleOnFocus(state, action);
  
      case "field-event-onBlur":
        return handleOnBlur(state, action);
  
      case "field-event-onChange":
        return handleOnChange(state, action);
  
      case "field-event-registerField":
        return handleRegisterField(state, action);
  
      case "field-event-unregisterField":
        return handleUnregisterField(state, action);
  
      case "array-event-add":
        return handleArrayAddAction(state, action);
  
      case "array-event-remove":
        return handleArrayRemoveAction(state, action);
  
      case "form-event-onSubmit":
        return handleFormOnSubmit(state);

      case "form-event-submitHandled":
        return handleFormSubmitHandled(state);

      case "form-set-isSubmitting":
        return setFormIsSubmitting(state, action);

      case "form-set-field-validator":
        return state.setIn(["validators", action.payload.field], action.payload.value);
    
      default:
        return state;
    }
  },
  getInitialState = (options : FormOptions) => {
    const 
      validators = options.initialValidators,
      { decorators } = options,
      { validationDependencies  = Immutable.Map() } = options,
      management =  options.management || getDefaultManagement(),
      state = parseInitialData(options.initialValues);

    return Immutable.Map({
      state,
      validators,
      management,
      validationDependencies,
      decorators,
    });
  };