import { ImmutableFormActions } from "./types-actions";

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

type DecoratorOptions = {
  formData: ImmutableFormState;
  field: string;
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
  
  
export type HandleChangeFunc = (field: any, value: any) => void;
export type HandleBlurFunc = (field: any) => void;
export type HandleFocusFunc =  (field: any) => void;
  
export type FormMutators = {
  readonly setFieldValidator: (field: string, validator: ImmutableFormValidatorFunc) => void;
  readonly registerField: (field: string) => void;
  readonly unregisterField: (field: string) => void;
}
  
export type Getters = {
  getFieldState: (field: any) => Immutable.Map<string, any>;
  getFormData: () => Immutable.Map<string, any>;
}
  
export type ImmutableFormHandlers = ArrayMutators & FieldMutators & FormMutators & Getters & {
  formState: ImmutableFormState;
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
  validate?: ImmutableFormValidatorFunc;
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