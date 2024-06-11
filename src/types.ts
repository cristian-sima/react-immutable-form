import { ReactElement } from "react";
import { ImmutableFormActions } from "./types-actions";

export interface FormInterface { readonly form :  ImmutableFormHandlers}

export interface ImmutableFormProps {
  readonly children: ReactElement<FormInterface>;
  readonly handlers: ImmutableFormHandlers;
}

export type onSubmitFunc = (values : ImmutableFormState, dispatchFormAction : React.Dispatch<ImmutableFormActions>) => any;

export type onSubmitErrorFunc =  (errors :  Immutable.Map<string, any>, dispatchFormAction : React.Dispatch<ImmutableFormActions>) => any;

export type FormOptions = {
  initialValues: InitialValues, 
  initialValidators: ImmutableFormValidators,
  decorators: ImmutableFormDecorators;
  management? : Immutable.Map<string, any>,
  validationDependencies? : ImmutableFormValidationDependencies, 
  onSubmitError?: onSubmitErrorFunc;
}

export type DecoratorOptions = {
  formData: ImmutableFormState;
  indexFieldName: INDEX_FieldName;
  value: string;
  nodes: Nodes;
}

export type Decorator = (options : DecoratorOptions) => any; 

export type ImmutableFormDecorators = Immutable.Map<string, Decorator>

export type ManagementState = Immutable.Map<string, any>;

export type ImmutableFormSingleField = Immutable.Map<string, any>;

export type ImmutableFormArray =  Immutable.List<ImmutableFormSingleField>
export type ImmutableFormField = ImmutableFormSingleField
  
export type ValidationResult = string | undefined;
  
export type ImmutableFormValidatorFunc = (value: any, formState : ImmutableFormState) => ValidationResult;
  
export type ImmutableFormState = Immutable.Map<string, any>;
  
export type ImmutableFormValidators = Immutable.Map<string, ImmutableFormValidatorFunc | ImmutableFormValidators>
  
export type ImmutableFormValidationDependencies = Immutable.Map<string, any>;
  
export type InitialValues = Immutable.Map<string, any>
  
export type DependenciesValidationList = Immutable.List<string>;
// basic 
  
export type Nodes = Immutable.List<string>;
  
export type RemoveArrayFunc = (listName: string, ID: string) => void;
  
/**
 * If the field is an array: 
 *  - this field is `[ARRAY_NAME]`.`[ID_OF_ROW]`.`[NAME_OF_FIELD]`
 * otherwise
 *  - this is the same as `FullFieldName` (the field name)
 */
export type ID_FieldName = string & { readonly __ID_FieldName: unique symbol };

/**
 * If the field is an array: 
 *  - this field is [`ARRAY_NAME`].[`INDEX_OF_ROW`].[`NAME_OF_FIELD`]
 * otherwise
 *  - this is the same as `FullFieldName` (the field name)
 */
export type INDEX_FieldName  = string & { readonly __INDEX_FieldName: unique symbol };

export type HandleChangeFunc = (idFieldName: string, value: any, indexFieldName?: INDEX_FieldName) => void;
export type HandleBlurFunc = (idFieldName: ID_FieldName, indexFieldName : INDEX_FieldName) => void;
export type HandleFocusFunc =  (idFieldName: ID_FieldName, indexFieldName : INDEX_FieldName) => void;
  
export type FormMutators = {
  readonly setFieldValidator: (idFieldName: ID_FieldName, validator: ImmutableFormValidatorFunc) => void;
  readonly registerField: (idFieldName: ID_FieldName, name : INDEX_FieldName) => void;
  readonly unregisterField: (idFieldName: ID_FieldName, name : INDEX_FieldName) => void;
}
  
export type Getters = {
  getFieldState: (idFieldName: ID_FieldName) => Immutable.Map<string, any>;
  getFormData: () => Immutable.Map<string, any>;
}


/**
 * Type representing the handlers for an immutable form.
 */
export type ImmutableFormHandlers = {
  /** The current state of the form. */
  formState: ImmutableFormState;
  /** The management state of the form. */
  management: ManagementState;
  /**
   * Function to handle form submission.
   * @param event The form submission event.
   */
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  /** Function to handle form submission completion. */
  formSubmitHandled: () => void;
  /**
   * Function to set the submission status of the form.
   * @param isSubmitting Whether the form is currently submitting.
   * @param error Optional error message if submission failed.
   */
  formSetIsSubmitting: (isSubmitting: boolean, error?: string) => void;
} & ArrayMutators & FieldMutators & FormMutators & Getters;
  
// fields 
export type FieldMutators = {
  readonly handleChange: HandleChangeFunc;
  readonly handleFocus:HandleFocusFunc;
  readonly handleBlur: HandleBlurFunc;
}
  
export type InputProps<T extends HTMLElement> = T extends HTMLInputElement
  ? React.InputHTMLAttributes<T> & { ref?: React.RefObject<T> }
  : T extends HTMLTextAreaElement
    ? React.TextareaHTMLAttributes<T> & { ref?: React.RefObject<T> }
    : React.HTMLAttributes<T> & { ref?: React.RefObject<T> };

export type GenericFieldProps<T extends HTMLElement> = {
  component?: React.JSXElementConstructor<FieldRendererProps<T> & any>;
  readonly name: string;
  validate?: ImmutableFormValidatorFunc;
  inputProps?:  InputProps<T>;
}
  
export type FieldRendererProps<T extends HTMLElement> = FieldMutators & {
  readonly customOnBlur?: (event: React.FocusEvent<T, Element>, handleBlur: HandleBlurFunc, idFieldName: ID_FieldName, indexFieldName : INDEX_FieldName) => any;
  readonly customOnFocus?: (event: React.FocusEvent<T, Element>, handleFocus: HandleFocusFunc, idFieldName: ID_FieldName, indexFieldName : INDEX_FieldName) => any;
  readonly customOnChange?: (event: React.ChangeEvent<T>, handleChange: HandleChangeFunc, idFileName: ID_FieldName, indexFileName: INDEX_FieldName) => any;
  disabled: boolean;
  readonly elementProps?: InputProps<T>;
  readonly indexFileName: INDEX_FieldName;
  readonly idFileName: ID_FieldName;
  readonly data: Immutable.Map<string, any>;
  componentProps?: Immutable.Map<string, any>;
  hideError?: boolean;
};
  
// arrays
  
export type FieldProps<T extends HTMLElement> = GenericFieldProps<T> & {
  ID?: string;
  listName?: string;
  index?: number;
  componentProps?: Immutable.Map<string, any>;
  hideError?: boolean;
}
  
export type ArrayRendererProps = {
  name: string;
  data: Immutable.List<Immutable.Map<string, any>>
  add: (listName: string, value?: any) => void;
  remove: RemoveArrayFunc;
}
  
export type FormArrayProps = {
  readonly name: string;
  readonly children: (props: ArrayRendererProps) => any;
}
  
export type ArrayMutators = {
  handleArrayAdd: (listName : string, value: Immutable.Map<string, any>) => void;
  handleArrayRemove: (listName: any, index: any) => void;
}


export type TranslationMap = {
  [key: string]: string;
};


export type updateValuesStateOptions = {
  whatToSet : any;
  fieldKey : string;
  nodes: Nodes;
}

export type verifyAllItemsFuncOptions = {
  validators: ImmutableFormValidators;
  formState: ImmutableFormState;
  management: ManagementState;
}