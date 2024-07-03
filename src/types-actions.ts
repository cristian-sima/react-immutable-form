import Immutable from "immutable";
import { ID_FieldName, INDEX_FieldName, ImmutableFormValidatorFunc } from "./types";

export type FieldEventOnFocusAction = {
  type: "field-event-onFocus",
  payload: {
    idFieldName: ID_FieldName;
    indexFieldName: INDEX_FieldName;
  };
}
  
export type FieldEventOnBlurAction = {
  type: "field-event-onBlur",
  payload: {
    idFieldName: ID_FieldName;
    indexFieldName: INDEX_FieldName;
  };
}
  
export type FieldEventOnChangeAction = {
  type: "field-event-onChange",
  payload: {
    idFieldName: ID_FieldName;
    indexFieldName: INDEX_FieldName;
    value: any;
  };
}
  
export type FieldEventRegisterFieldAction = {
  type: "field-event-registerField",
  payload: {
    idFieldName: ID_FieldName;
    indexFieldName: INDEX_FieldName;
  };
}
  
export type FieldEventUnregisterFieldAction = {
  type: "field-event-unregisterField",
  payload: {
    idFieldName: ID_FieldName;
    indexFieldName: INDEX_FieldName;
  };
}

// array 

export type ArrayEventAdd = {
  type: "array-event-add",
  payload: {
    ID: string;
    listName: string;
    data: any;
  };
}
  
export type ArrayEventRemove = {
  type: "array-event-remove",
  payload: {
    listName: string;
    ID: string;
  };
}

export type FormSetDerivedState = {
  type: "form-set-derived-state",
  payload: Immutable.Map<string, any>;
}
  
// form 
  
type FormEventOnSubmit = {
  type: "form-event-onSubmit",
}
  
type FormEventSubmitHandled = {
  type: "form-event-submitHandled",
}

export type FormSetFieldValidator = {
  type: "form-set-field-validator",
  payload: {
    idFieldName: ID_FieldName;
    value: ImmutableFormValidatorFunc;
  };
}

export type FormSetIsSubmitting = {
  type: "form-set-isSubmitting",
  payload: {
    error?: string;
    isSubmitting: boolean;
  };
}

type FormResetToDefault = {
  type:  "form-reset-to-default",
  payload: Immutable.Map<string, any>;
}

export type ImmutableFormActions = 
  // field
  FieldEventOnFocusAction | 
  FieldEventOnBlurAction | 
  FieldEventOnChangeAction | 
  FieldEventOnChangeAction | 
  FieldEventRegisterFieldAction | 
  FieldEventUnregisterFieldAction | 
  // array 
  ArrayEventAdd | 
  ArrayEventRemove | 
  // form 
  FormEventOnSubmit |
  FormSetFieldValidator |
  FormEventSubmitHandled |
  FormSetIsSubmitting |
  FormSetDerivedState |
  FormResetToDefault