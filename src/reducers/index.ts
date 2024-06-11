/* eslint-disable new-cap */

import Immutable, { List } from "immutable";
import { FormOptions, InitialValues } from "../types";
import { ImmutableFormActions } from "../types-actions";
import { createRow, getDefaultField } from "../util";
import { generateUniqueUUIDv4 } from "../uuid";
import { handleArrayAddAction, handleArrayRemoveAction } from "./array";
import { handleOnBlur } from "./field-onBlur";
import { handleOnChange } from "./field-onChange";
import { handleOnFocus } from "./field-onFocus";
import { handleRegisterField } from "./field-register";
import { fieldSetValidator } from "./field-setValidator";
import { handleUnregisterField } from "./field-unRegister";
import { handleFormOnSubmit, handleFormSubmitHandled, setFormIsSubmitting } from "./form-events";

const 
  getDefaultManagement = () => (
    Immutable.fromJS({
      dirtyFields: Immutable.Set<string>(),
    })
  ),
  initialFieldState = (value: any, name : string) => {
    const
      processList = (rows : Immutable.List<any>, lisName : string) => (
        rows.
          reduce((acc, row: any) => {
            const
              ID = generateUniqueUUIDv4(),
              result = createRow(ID, row, lisName);

            return acc.push(result);
          }, Immutable.List<Immutable.Map<string, any>>())
      );

    if (List.isList(value)) {
      return Immutable.fromJS(
        processList(value as Immutable.List<any>, name),
      );
    }

    return getDefaultField(name, value);
  },
  parseInitialData = (target: InitialValues) => Immutable.Map(
    target.reduce((acc, value, key) => (
      acc.set(key, initialFieldState(value, key))
    ), Immutable.Map() as InitialValues),
  );

export const 
  /** @internal */
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
        return fieldSetValidator(state, action);
    
      default:
        return state;
    }
  },

  /** @internal */
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