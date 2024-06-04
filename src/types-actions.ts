import { iFormValidatorFunc } from "./types";

export type FieldEventOnFocusAction = {
  type: "field-event-onFocus",
  payload: {
    field: string;
  };
}
  
export type FieldEventOnBlurAction = {
  type: "field-event-onBlur",
  payload: {
    field: string;
  };
}
  
export type FieldEventOnChangeAction = {
  type: "field-event-onChange",
  payload: {
    value: any;
    field: string;
  };
}
  
export type FieldEventRegisterFieldAction = {
  type: "field-event-registerField",
  payload: {
    field: string;
  };
}
  
export type FieldEventUnregisterFieldAction = {
  type: "field-event-unregisterField",
  payload: {
    field: string;
  };
}

// array 

export type ArrayEventAdd = {
  type: "array-event-add",
  payload: {
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
  
// form 
  
export type FormEventOnSubmit = {
  type: "form-event-onSubmit",
}
  
export type FormEventSubmitHandled = {
  type: "form-event-submitHandled",
}

export type FormSetFieldValidator = {
  type: "form-set-field-validator",
  payload: {
    field: string;
    value: iFormValidatorFunc;
  };
}

export type FormSetIsSubmitting = {
  type: "form-set-isSubmitting",
  payload: {
    error?: string;
    isSubmitting: boolean;
  };
}

export type iFormActions = 
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
  FormSetIsSubmitting