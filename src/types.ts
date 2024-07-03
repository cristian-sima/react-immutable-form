import Immutable from "immutable";
import { ImmutableFormActions } from "./types-actions";

export interface ImmutableFormInterface<T> { readonly form :  ImmutableFormHandlers<T>}

export type ImmutableFormProps<T> = ImmutableFormOptions & {
  children: ((props: ImmutableFormHandlers<T>) => React.ReactNode) | React.ReactElement<ImmutableFormHandlers<T>>;
  onSubmit: onSubmitImmutableFormFunc;
} 

/**
 * Async function handling form submission with Immutable.js data.
 *
 * @param values Immutable.Map<string, any> - The form values as an Immutable Map.
 * @returns void
 * @throws ImmutableFormError if there is an error during form submission.
 */
export type onSubmitImmutableFormFunc = (values : ImmutableFormState, dispatchFormAction : React.Dispatch<ImmutableFormActions>) => Promise<void>;

export type onSubmitImmutableFormErrorFunc =  (errors :  Immutable.Map<string, any>, dispatchFormAction : React.Dispatch<ImmutableFormActions>) => any;

/**
 * Options for configuring a form.
 */
export type ImmutableFormOptions = {
  /**
   * The initial values for the form fields, specified as an Immutable.Map where keys are field names
   * and values are the initial values for those fields.
   * 
   * This allows setting default values for the form fields upon initialization.
   */
  initialValues?: InitialValues,

  /**
   * A map containing all the validators for the form fields, specified as Immutable.Map where keys are field names
   * and values are functions that validate the corresponding field values.
   * 
   * If a field has a `validation` prop specified directly, that prop takes precedence over the validator in this map.
   * Validators are used to enforce rules and constraints on the form field values.
   */
  initialValidators?: ImmutableFormValidators,

  /**
   * A collection of decorator functions specified as a key-function pair, where the key is a field name
   * and the function receives the current state of the form and can derive a new state (e.g., performing calculations or transformations).
   * 
   * Decorators are used to dynamically alter or derive new state values based on the current state of the form.
   */
  decorators?: ImmutableFormDecorators,

  /** 
   * The initial management state for the form, specified as an Immutable.Map. This state can include various
   * properties related to the management and behavior of the form.
   * 
   * Properties include:
   * - `showRenderCounts`: A boolean indicating whether to display the number of renders for each field.
   * 
   * This state helps manage form-level settings and behaviors.
   */
  management?: Immutable.Map<string, any>,

  /**
   * The initial derived state for the form, specified as an Immutable.Map. This state is used for calculations
   * and other derived values based on the form data.
   * 
   * Derived state values are calculated based on the initial form data and can be used to perform complex calculations
   * or transformations that depend on multiple form fields.
   */
  derived?: Immutable.Map<string, any>,

  /**
   * A map specifying dependencies between form fields for validation purposes, defined as Immutable.Map where
   * keys are field names and values are arrays of dependent field names.
   * 
   * When a field value changes, its dependencies are notified and re-validated. For example, if field `a` depends on field `b`,
   * and field `b` depends on field `c`, changing the value of `a` will trigger validation for both `b` and `c`.
   * 
   * This ensures that interdependent fields are consistently validated whenever any related field changes.
   */
  validationDependencies?: ImmutableFormValidationDependencies,

  /**
   * A function that is called when the form submission results in an error. This function receives
   * an error object or message as a parameter and can handle the error accordingly.
   * 
   * This allows custom handling of submission errors, such as displaying error messages or performing
   * specific actions based on the error type.
   */
  onSubmitError?: onSubmitImmutableFormErrorFunc;

  /**
   * Optional callback function to handle errors occurring during form submission.
   * @param error The error object representing the form submission error, if available.
   */
  onServerFailed?: (error: string) => void;
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
export type ImmutableFormHandlers<T> = {
  /** The current state of the form. */
  formState: ImmutableFormState;
  /**
   * It allows to receives the requested values from the form
   */
  getRequestedValues: <K extends keyof T>(requiredKeys : K[]) => PartialPick<T, K>
  /**
   * It returns all the form values. 
   * Please use this, only if you need to use all keys
   */
  getAllValues: () => T
  /** The management state of the form. 
   * 
   * Contains: 
   *  - `isSubmitting` boolean - if the form is submitting to the server
   *  - `formError` string|undefined - The error from submitting from the server
  */
  management: ManagementState;
  /** The derived state of the form. It includes all possible extra calculations using the form */
  derivedState: Immutable.Map<string, any>;
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
  /**
   * Function to modify the derived state
   * @param newState The new derived state
   */
  formSetDerivedState: (newState: Immutable.Map<string, any>) => void;

  /**
   * It resets the form to the initial values (it clears the form)
   */
  formResetToDefault: () => void;
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

export type GenericImmutableFieldProps<T extends HTMLElement> = {
  component?: React.JSXElementConstructor<FieldRendererProps<T> & any>;
  componentProps?: any;
  readonly name: string;
  validate?: ImmutableFormValidatorFunc;
  inputProps?:  InputProps<T>;
}


export type FieldRendererProps<T extends HTMLElement> = FieldMutators & {
  // passed automatically 
  readonly showRenderCounts?: boolean;
  readonly disabled: boolean;
  readonly indexFileName: INDEX_FieldName;
  readonly idFileName: ID_FieldName;
  readonly data: Immutable.Map<string, any>;
  readonly customOnBlur?: (event: React.FocusEvent<T, Element>, handleBlur: HandleBlurFunc, idFieldName: ID_FieldName, indexFieldName : INDEX_FieldName) => any;
  readonly customOnFocus?: (event: React.FocusEvent<T, Element>, handleFocus: HandleFocusFunc, idFieldName: ID_FieldName, indexFieldName : INDEX_FieldName) => any;
  readonly customOnChange?: (event: React.ChangeEvent<T>, handleChange: HandleChangeFunc, idFileName: ID_FieldName, indexFileName: INDEX_FieldName) => any;

  // custom 
  readonly elementProps?: InputProps<T>;
  readonly componentProps?: Immutable.Map<string, any>;
  readonly hideError?: boolean;
  readonly parse?: (rawValue : any) => string | number | undefined;
};
  
// arrays
  
export type ImmutableFieldProps<T extends HTMLElement> = GenericImmutableFieldProps<T> & {
  ID?: string;
  listName?: string;
  index?: number;
  hideError?: boolean;
  render?: (props: FieldRendererProps<T>) => JSX.Element;
  parse?: (rawValue : any) => string | number | undefined;
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

export type Words = {
  [key: string]: any;
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

export type PartialPick<T, K extends keyof T> = {
  [P in K]: T[P];
};