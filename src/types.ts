import { iFormActions } from "./types-actions";

export type onSubmitFunc = (values : iFormState, dispatchFormAction : React.Dispatch<iFormActions>) => any;

export type onSubmitErrorFunc =  (errors :  Immutable.Map<string, any>, dispatchFormAction : React.Dispatch<iFormActions>) => any;

export type FormOptions = {
  initialValues: InitialValues, 
  initialValidators: iFormValidators,
  decorators: iFormDecorators;
  management? : Immutable.Map<string, any>,
  validationDependencies? : iFormValidationDependencies, 
  onSubmitError?: onSubmitErrorFunc;
}

type DecoratorOptions = {
  formData: iFormState;
  field: string;
  value: string;
  nodes: Nodes;
}

export type Decorator = (options : DecoratorOptions) => any; 

export type iFormDecorators = Immutable.Map<string, Decorator>

export type ManagementState = Immutable.Map<string, any>;

export type iFormSingleField = Immutable.Map<string, any>;

export type iFormArray =  Immutable.List<iFormSingleField>
export type iFormField = iFormSingleField
  
export type ValidationResult = string | undefined;
  
export type iFormValidatorFunc = (value: any, formState : iFormState) => ValidationResult;
  
export type iFormState = Immutable.Map<string, any>;
  
export type iFormValidators = Immutable.Map<string, iFormValidatorFunc | iFormValidators>
  
export type iFormValidationDependencies = Immutable.Map<string, any>;
  
export type InitialValues = Immutable.Map<string, any>
  
export type DependenciesValidationList = Immutable.List<string>;
// basic 
  
export type Nodes = Immutable.List<string>;
  
export type RemoveArrayFunc = (listName: string, ID: string) => void;
  
  
export type HandleChangeFunc = (field: any, value: any) => void;
export type HandleBlurFunc = (field: any) => void;
export type HandleFocusFunc =  (field: any) => void;
  
export type FormMutators = {
  readonly setFieldValidator: (field: string, validator: iFormValidatorFunc) => void;
  readonly registerField: (field: string) => void;
  readonly unregisterField: (field: string) => void;
}
  
export type Getters = {
  getFieldState: (field: any) => Immutable.Map<string, any>;
  getFormData: () => Immutable.Map<string, any>;
}
  
export type FormInterface = ArrayMutators & FieldMutators & FormMutators & Getters & {
  formState: iFormState;
  management: ManagementState;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}
  
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
  validate?: iFormValidatorFunc;
  inputProps?:  InputProps<T>;
}

  
export type FieldRendererProps<T extends HTMLElement> = FieldMutators & {
  readonly customOnBlur?: (event: React.FocusEvent<T, Element>, handleBlur: HandleBlurFunc, name: string) => any;
  readonly customOnFocus?: (event: React.FocusEvent<T, Element>, handleFocus: HandleFocusFunc, name: string) => any;
  readonly customOnChange?: (event: React.ChangeEvent<T>, handleChange: HandleChangeFunc, name: string) => any;
  disabled: boolean;
  readonly elementProps?: InputProps<T>;
  readonly name: string;
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
  handleArrayRemove: (field: any, index: any) => void;
}


export type TranslationMap = {
  [key: string]: string;
};

type metaFields = "isTouched" | "theError" | "isFocused" | "initialValue" | "isDirty"

export type MetaProps = Immutable.Map<keyof metaFields, any>