import { ID_FieldName, INDEX_FieldName, ImmutableFormValidatorFunc } from "./types";

export type FieldEventOnFocusAction = {
  type: "field-event-onFocus",
  payload: {
    field: ID_FieldName;
    name: INDEX_FieldName;
  };
}
  
export type FieldEventOnBlurAction = {
  type: "field-event-onBlur",
  payload: {
    field: ID_FieldName;
    name: INDEX_FieldName;
  };
}
  
export type FieldEventOnChangeAction = {
  type: "field-event-onChange",
  payload: {
    field: ID_FieldName;
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
    field: ID_FieldName;
    name: INDEX_FieldName;
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
    field: ID_FieldName;
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
  FormSetIsSubmitting