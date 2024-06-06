react-immutable-form - the **immutableJS form** library 


### Fast, scalable, efficient, predictable form

💥 [**handles 1️⃣0️⃣0️⃣0️⃣ fields, providing instant response**](https://bundlephobia.com/result?p=react-immutable-form) 💥

<img src="docs/logo.svg" alt="react-immutable-form" style="width:100%; height:auto;" />


[![size](https://badgen.net/bundlephobia/minzip/react-immutable-form@1.0.9)](https://badgen.net/bundlephobia/minzip/react-immutable-form@1.0.9) [![NPM Downloads](https://img.shields.io/npm/dm/react-immutable-form.svg?style=flat)](https://www.npmjs.com/package/react-immutable-form)
![React Compatibility](https://badgen.net/badge/React/17%20%26%2018/blue)![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue.svg)


# Principles
**react-immutable-form** was created taking into account the following principles:

1. *efficiency* ✅
    - it updates `just the necessary fields`, doing it efficiently using Immutable.Js
    - it can handle `1000 inputs out-of-the-box`, without any optimization 
    - it `receives decorators` for computing additional states (eg. total of an invoice)
    - `instant feedback` for validation, submitting and other events
    - `smart-management` of the fields, using a complex system of references 
        - if the fields are `displayed`, their value `is verified `
        - if they are `hidden` they `will not be validated`, but `their values are kept`

<img src="docs/cycle.svg" alt="react-immutable-form" style="width:100%; height:auto;" />

2. *simplicity* ✅
    -  comes out-of-the-box with all the features you would want to use:
    - `full integration with arrays` (add rows, delete, etc) - using `uuid as keys`
    - *FocusPromt* - `warn the user` the form has unsaved changes
    - *ErrorDisplay* - shows the `errors in a friendly way`
    - `easy access` for the state
    - `simple API` for managing the inputs
    

<img src="docs/field.svg" alt="react-immutable-form" style="width:100%; height:auto;" />

3. *focused on normal used cases* ✅
    - your form must allow to get data, validate data, show errors and derive a new state
    - it handles `the most common used cases`, thus solving their key problems and removing the complexity of dealing with complex cases 
    - create your own custom field using *Field* and *FieldRender*
    - it provides out the box custom Inputs using `react-immutable-form-with-bootstrap` library
        - *SimpleInput*         - it is a string input
        - *TemplateInput*       - used for input with a label
        - *NumericInput*        - used for numbers
        - *NumericTemplate*     - used for numeric input with a label
        - *SimpleTextarea*      - used for textarea
        - *TextareaTemplate*    - used for textarea with a label
        - *SimpleSelect*        - displays a select 
        - *SelectTemplate*      - a select input with a label

## A simple illustration of an invoice form

<img src="docs/state.svg" alt="react-immutable-form" style="width:100%; height:auto;" />

## Other features:
1. `Small size` of library  ⚡⚡⚡⚡ [![size](https://badgen.net/bundlephobia/minzip/react-immutable-form@1.0.9)](https://badgen.net/bundlephobia/minzip/react-immutable-form@1.0.9)



2. `No extra dependencies` (React and ImmutableJS are excluded)
<img src="docs/dependencies.svg" alt="react-immutable-form" style="width:100%; height:auto;" />

# Installation 

To install please run the following: `npm i react-immutable-form`

# FAQ

## Why using Immutable.JS, while Emmer is the newest big thing?

For one big reason, that Emmer can not provide: `Performance`: Immutable.JS can offer performance benefits for certain operations due to structural sharing. This means it can efficiently handle large data sets.

Given a scenario when you have `a complicated form`, with possibly an array of hundreds of rows, each row with a few fields, Immutable.JS backs you by providing efficiency `without thinking about it`. Starting to think about using hook in this complex scenario may backfire


## Immutable.JS requires additional steps for conversion, so how can this be simple?

This is not quite true.

If you keep you stare in an Immutable.JS redux state, you have all the operations in Immutable.JS. The only 2 situations when there is a need for using `.toJS()` or `.fromJS()` are when you are reading from server or writing to it.

In all other scenarios, you will handle the data in Immutable functions. So why don't you handle it in an Immutable way inside the forms?


## Why not using `redux-form` rather than this library?

[Redux form](https://redux-form.com/8.3.0/) is a very powerful library, however there are a few downfalls: 
1. It does `not provide support for React` hooks (React 17/18)
2. It `is no longer maintained` as the focus is now for `react-final-form`
3. `Complex system` of action creators and getters, whiles `react-final-form` has simple API
4. Different philosophy: 
  - `react-immutable-form` does `not pollute the entire react state` and just use a separate redux-state for each form, where as `redux-form` injects the entire form in the app state
  - `redux-form` supports all events and has an extension for Immutable, whiles `react-immutable-form` was created using Immutable in mind

## If i have a nested array, how to handle it?

For nested structures, it is a good idea to normalize data and reduce it to one level of complexity. Working with deep structures is not a good practice for array. 

# Examples 

The examples are in developing phase. We appreciate if you send improvements

# Create a new form:

In order to create a new form, you must pass 2 arguments to the function `useImmutableForm`:
  1. the `options` contains all the options needed to illustrate the functionality of your form
  2. the `onSubmit` specify what happens in the case of a successful submit

The following examples shows the use of `useImmutableForm` for:
  - defining a field `Total`, 
    - which has an `initial value` of `1`
    - `is computes a derived state` of all sums of previous values of Total
    - is check the Total `has at least 3 chars`
  - it `handles the onSubmit` when the Total is greater than 3 chars and the submit button is pressed
  - it `handles the onSubmitError` when the Total is less than 3 chars 

```jsx
 import { useImmutableForm, onSubmitFunc, onSubmitErrorFunc, ImmutableFormDecorators } from "react-immutable-form";
 import Immutable from "immutable";

 const 
      // the initial values 
      initialValues = Immutable.fromJS({
        Total           : "1",
      }),

      // the validators 
      atLeastChars = (nrOfChars :number) => (
        (value: any) => {
          if (typeof value !== "string" || String(value).length < nrOfChars ) {
            return `At least ${nrOfChars} chars`;
          }
    
          return undefined;
        }
      ),
      initialValidators = Immutable.Map({
        "Total" : atLeastChars(3),
      }),
      // define onSubmit
      onSubmit : onSubmitFunc  = (values) => 
      {
        console.log("values.toJS()", values.toJS());

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              // done 
              resolve("");
            } catch (error) {
              // errors
              reject(error);
            }
          }, 2000);
        });
      },

      // in case the form fails to validate
      onSubmitError : onSubmitErrorFunc = useCallback((errors) => {
        const cb = (node : any) => {
          // handle the errors given as a node:JSX.Element
        };
  
        return onErrors(cb)(errors);
      }, []),
      
      // define your decorators
      decorators : ImmutableFormDecorators = Immutable.Map({
        "Total": ({ formData, nodes, value }) => {

          const 
            increaseTotal = () => {
              return (
                formData.updateIn(["derived", "sumOfAllTotals"], (
                  (newAge : any = 0) => (Number(value) + 10) as any
                ))
              )
            };
            
          formData.setIn(["derived", "sumOfAllTotals"], increaseTotal());
        },
      }),

      // prepare the options. any of the options are optional
      ImmutableFormOptions : FormOptions = {
        initialValues,
        initialValidators, 
        onSubmitError,
        decorators,
      },

      // create the handles
      formHandlers = useImmutableForm(ImmutableFormOptions, onSubmit);
```

The second step is to write our form

```jsx
import React from "react";
import { Field } from "react-immutable-form";

const FormContent = ({ form }) => (
  <>
    <Field
      inputProps={{ autoFocus: true }}
      name="Total"
     />
     {
      "Total previous sums:" + form.formState.getIn(["derived", "sumOfAllTotals"])
     }
    <button
      className="btn btn-primary mx-1"
      disabled={form.formState.getIn(["management", "isSubmitting"])}
      type="submit">
      {"Submit form"}
    </button>
  </>
);
```

Now, we are ready to inject our high-efficiency management to React. This can be done in two ways:

```jsx

import React from "react";
import { ImmutableForm } from "react-immutable-form";

// ... prepare the handles (see above)

const 
  Form = ({ handlers, children } : any) => (
    // here the Form injects the handlers into the FormContent 
    <ImmutableForm handlers={formHandlers}> 
      <FormContent form={undefined as any} />
    </ImmutableForm>
  ),
```
    
which is the same as

```jsx
import React from "react";
import { ImmutableFormContext } from "react-immutable-form";

// ... prepare the handles (see above)

const 
  Form = ({ handlers, children } : any) => (
    <ImmutableFormContext.Provider value={handlers}>
      <form onSubmit={handlers.handleSubmit}>
         <FormContent handlers={handlers} />
      </form>
    </ImmutableFormContext.Provider>
  ),
```
That's all to make it working. Of course, the form can accept different options and can be customized according to your needs.

## Full Example

The following example illustrates the use of all features of this library.

```jsx
/* eslint-disable max-lines */
/* eslint-disable no-magic-numbers */
// import { JSONSyntaxFromData } from "Beta/Common/Syntax";

import Immutable, { List } from "immutable";
import React, { useCallback, useContext, useRef } from "react";
import { useDispatch } from "react-redux";
import { LoadingMessage } from "x25/Messages";
import { notify, notifyError, notifyWarning } from "x25/actions";
import { validateDate, validateFloat, validateSelect } from "x25/utility";

import { getArray, getArrayRowFieldValue } from "react-immutable-form/getters";
import { FieldProps, FormOptions, RemoveArrayFunc, ImmutableFormDecorators, onSubmitErrorFunc, onSubmitFunc } from "react-immutable-form/types";

import { DateInput, DateTemplate, InputTemplate, NumericInput, NumericTemplate, SelectTemplate, SimpleInput, SimpleSelect, SimpleTextarea, SwitchInput, TextareaTemplate, onErrors } from "react-immutable-form-with-bootstrap";

import { JSONSyntaxFromData } from "Beta/Common/Syntax";

// FormPrompt was declarated:
// const FormPrompt = createFormPromter(history);
import { FormPrompt } from "Beta/store/store";
import { ImmutableField as Field, ImmutableFieldRenderer as FieldRenderer, ImmutableFormArray as FormArray, ImmutableFormContext as FormContext, useImmutableForm } from "react-immutable-form";

type TableRowProps = {
  readonly current: Immutable.Map<string, any>;
  readonly ID: string;
  readonly index: number;
  readonly listName: string;
  readonly remove: RemoveArrayFunc;
}

type FormInnerProps = {
  readonly formError: string;
  readonly isSubmitting: boolean;
  readonly hide: boolean;
  readonly nameInput: React.RefObject<HTMLInputElement>;
  readonly formState: Immutable.Map<string, any>
  readonly setField: (field : string, value : any) => any;
  readonly focus: () => any;
  readonly toggle: () => any;
  readonly toggleJSONSource: () => any;
}

const 
  isFloat = (raw: string) => {
    const floatRegex = /^-?\d+(?:[.]\d*?)?$/u;

    return floatRegex.test(raw);
  },
  isNumeric = (valueToCheck : any) => (
    valueToCheck !== "" && isFloat(valueToCheck) && typeof valueToCheck === "string"
  ),
  NR_OF_ROWS = 5,
  itemsListName = "Items",
  TableDetails = () => {
    const
      { handleArrayAdd, formState } = useContext(FormContext);

    return (
      <>
        <span className="badge text-bg-primary">
          {"Items: "}
          { (formState.getIn([itemsListName]) as any).size as number }
        </span>
        <button
          className="btn btn-success ms-1"
          onClick={() => handleArrayAdd(itemsListName, Immutable.Map({
            Name    : "cristina",
            Surname : "water",
          }))}
          type="button">
          {"+"}
        </button>
      </>
    );
  },
  TableRowInner = ({ ID, index, listName, remove }: TableRowProps) => {
    const 
      renderCount = useRef(0),
      rowProps = React.useMemo(() => ({
        listName,
        ID,
        index,
      } as FieldProps<HTMLInputElement>), [ID, listName, index]);

    React.useEffect(() => {
      renderCount.current += 1;
    });

    return (
      <tr key={ID}>
        <td key={`td-${ID}-nume`}>
          <Field
            {...rowProps}
            component={FieldRenderer}
            name="Name"
          />
        </td>
        <td>
          <Field
            {...rowProps}
            component={FieldRenderer}
            name="Surname" />
        </td>
        <td>
          <Field
            {...rowProps}
            component={FieldRenderer}
            name="Age" />
        </td>
        <td>
          <Field
            {...rowProps}
            component={FieldRenderer}
            name="Location" />
        </td>
        <td>
          <Field
            {...rowProps}
            component={FieldRenderer}
            name="city" />
        </td>
        <td>
          <span className="badge text-bg-warning">{renderCount.current}</span>
          <button
            className="btn btn-danger"
            onClick={() => remove(listName, ID)}
            type="button">
            {"x"}
          </button>
        </td>
      </tr>
    );
  },
  TableRow = React.memo(TableRowInner),
  ItemsInner = () => (
    <FormArray name={itemsListName}>
      {({ data, name: listName, remove }) => (
        <table>
          <thead>
            <tr>
              <th>
                  Name
              </th>
              <th>
                  Surname
              </th>
              <th>
              Age
              </th>
              <th>
              Location
              </th>
              <th>
              City
              </th>
            </tr>
          </thead>
          {/* <TransitionGroup component="tbody"> */}
          <tbody>
            {data.map((current, index) => {
              if (typeof current === "undefined") {
                return null;
              }
                
              const ID = current.get("ID");

              return (
                <TableRow
                  current={current}
                  ID={ID}
                  index={index}
                  key={ID}
                  listName={listName}
                  remove={remove} />
              );
            })}
          </tbody>
          {/* </TransitionGroup> */}
        </table>
      )}
    </FormArray>
  ),
  Items = React.memo(ItemsInner),
  FormInner = (props : FormInnerProps) => {

    const 
      { focus, formError, isSubmitting, toggle, nameInput, hide, toggleJSONSource, setField } = props,
      inputTemplateProps = React.useMemo(() => Immutable.Map({
        label: "County",
      }), []),
      numericInputComponentProps = React.useMemo(() => Immutable.Map({
        currency  : "USD",
        precision : 4,
      }), []),
      numericTemplateProps = React.useMemo(() => (
        numericInputComponentProps.mergeDeep(Immutable.Map({
          label: "Total without tax",
        }))
      ), []),
      textareaTemplateProps = React.useMemo(() => Immutable.Map({
        label: "Country",
      }), []),
      switchInputProps = React.useMemo(() => Immutable.Map({
        label: "Is the record deleted?",
      }), []),
      checkboxInputProps = React.useMemo(() => Immutable.Map({
        label    : "Also checkbox",
        checkbox : true,
      }), []),
      simpleSelectProps = React.useMemo(() => Immutable.Map({
        isImmutable     : true, 
        showEmptyOption : true,
        valueKey        : "ID",
        nameKey         : "Name",
        list            : Immutable.List<Immutable.Map<string, any>>([
          Immutable.Map({
            ID   : 1,
            Name : "Cat",
          }),
          Immutable.Map({
            ID   : 2,
            Name : "Dog",
          }),
          Immutable.Map({
            ID   : 3,
            Name : "Fox",
          }),
        ]),
      }), []),
      selectTemplateProps = React.useMemo(() => (
        simpleSelectProps.mergeDeep(Immutable.Map({
          label: "Animal",
        }))
      ), []),

      dateTemplateProps = React.useMemo(() => Immutable.Map({
        label: "Birthday",
      }), []),

      taxTotalValue = (props.formState.getIn(["TaxTotal", "value"]) || 0) as number,
      currentAnimalID = (props.formState.getIn(["AnimalID", "value"]) || 1) as number;

    return (
      <>
        {formError ? (
          <div className="alert alert-danger">
            {formError}
          </div>
        ) : null}
        {isSubmitting ? <LoadingMessage /> : (
          <div className="container">
            <div className="row">
              <div className="col-auto">
                <button
                  className="btn btn-primary mx-1"
                  disabled={isSubmitting}
                  onClick={() => focus()}
                  type="button">
                  {"Focus first"}
                </button>
                <button
                  className="btn btn-primary mx-1"
                  disabled={isSubmitting}
                  type="submit">
                  {"Submit form"}
                </button>
                <button
                  className="btn btn-primary mx-1"
                  disabled={isSubmitting}
                  onClick={toggle}
                  type="button">
                  {"Toggle fields"}
                </button>
                <br /><br />
                {"Total"}
                <Field
                  inputProps={{ autoFocus: false, ref: nameInput }}
                  name="Total" />
                <br />
                {"Same field, multiple times:"}
                {hide ? null : (
                  <>
                    <Field name="Vat" />
                    <Field name="Vat" />
                    <Field name="Vat" />
                  </>
                )}

                <div>
                  <hr />
                  <h6>{"SimpleInput"}</h6>
                  <ul>
                    <li>
                      {"showing text feedback: "}
                      <Field component={SimpleInput} name="City" />
                    </li>
                    <li>
                      {"hiding text feedback: "}
                      <Field component={SimpleInput} hideError name="City" />
                    </li>
                  </ul>
                  <hr />
                  <h6>{"InputTemplate"}</h6>
                  <Field
                    component={InputTemplate}
                    componentProps={inputTemplateProps}
                    name="County" 
                  />
                </div>
                <div>
                  <hr />
                  <h6>{"NumericInput"}</h6>
                  <ul>
                    <li>
                      {"with currency: "}
                      <Field 
                        component={NumericInput}
                        componentProps={numericInputComponentProps}
                        name="TaxTotal"
                      />
                    </li>
                    <li>
                      {"without currency: "}
                      <Field 
                        component={NumericInput}
                        componentProps={numericInputComponentProps.delete("currency")}
                        name="TaxTotal"
                      />
                    </li>
                  </ul>
                  <button 
                    className="btn btn-primary btn-sm ms-1"
                    onClick={() => setField("TaxTotal", 200.06)}
                    type="button">
                    {"Set 200,06"}
                  </button>
                  <button 
                    className="btn btn-primary btn-sm ms-1"
                    onClick={() => setField("TaxTotal", taxTotalValue + 1)}
                    type="button">
                    {"Add 1 to TaxTotal"}
                  </button>
                  <button 
                    className="btn btn-primary btn-sm ms-1"
                    onClick={() => setField("TaxTotal", taxTotalValue - 1)}
                    type="button">
                    {"Subtract 1 from TaxTotal"}
                  </button>
                  <hr />
                  <h6>{"NumericTemplate"}</h6>
                  <Field
                    component={NumericTemplate}
                    componentProps={numericTemplateProps}
                    name="InvoiceWithoutTotal" 
                  />
                </div>

                <div className="mt-1">
                  <h6>{"SimpleTextarea"}</h6>
                  <Field
                    component={SimpleTextarea}
                    name="Address" 
                  />
                  <h6>{"TextareaTemplate"}</h6>
                  <Field
                    component={TextareaTemplate}
                    componentProps={textareaTemplateProps}
                    name="Country" 
                  />
                </div>
                <hr />

                <div className="mt-1">
                  <h6>{"DateInput - integration with react-datepicker"}</h6>
                  <Field
                    component={DateInput}
                    name="InvoiceDate" 
                  />
                  <h6>{"DateTemplate"}</h6>
                  <Field
                    component={DateTemplate}
                    componentProps={dateTemplateProps}
                    name="Birthday" 
                  />
                </div>

                <hr />
                <div className="mt-1">
                  <h6>{"SwitchInput"}</h6>
                  <Field
                    component={SwitchInput}
                    componentProps={switchInputProps}
                    name="IsDeleted" 
                  />
                  <Field
                    component={SwitchInput}
                    componentProps={checkboxInputProps}
                    name="IsDeleted" 
                  />
                </div>
                <hr />
                <div className="mt-1">
                  <h6>{"SimpleSelect"}</h6>
                  <Field
                    component={SimpleSelect}
                    componentProps={simpleSelectProps}
                    name="AnimalID" 
                  />
                  {`Current AnimalID: ${ currentAnimalID}`}
                  <button 
                    className="btn btn-primary btn-sm ms-1"
                    onClick={() => setField("AnimalID", currentAnimalID%3+1 )}
                    type="button">
                    {"Get the next animal"}
                  </button>
                  <h6>{"SelectTemplate"}</h6>
                  <Field
                    component={SelectTemplate}
                    componentProps={selectTemplateProps}
                    name="AnimalID" 
                  />
                </div>

                {/* <Field component={Black} name='paraschiv' /> */}
                <TableDetails />
                <Items />
              </div>
              <div className="col-6">
                <button
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  onClick={toggleJSONSource}
                  type="button">
                  {"Schimbă sursa"}
                </button>
              </div>

            </div>
          </div>
        )}
      </>
    );
  },
  InnerRenderSum = ({ data } : { readonly data : any}) => (
    <div>
      {"Total: "}
      <JSONSyntaxFromData data={data} />
    </div>
  ),
  RenderSum = React.memo(InnerRenderSum),
  ShowSum = () => {
    const 
      form = useContext(FormContext);

    return (
      <RenderSum data={form.getFormData().get("derived")} />
    );
  },
  MyForm = () => {
    const 
      [ hide, setHide ] = React.useState(false),
      toggle= () => setHide(!hide),
      initialValues = Immutable.fromJS({
        Total           : "1",
        Vat             : "1",
        [itemsListName] : List(Array(NR_OF_ROWS).fill("").map((_value, index) => Immutable.Map({
          Name    : "N",
          Surname : `Caisa ${index}`,
        }))),
      }),

      atLeastChars = (nrOfChars :number) => (
        (value: any) => {
          if (typeof value !== "string" || String(value).length < nrOfChars ) {
            return `At least ${nrOfChars} chars`;
          }
    
          return undefined;
        }
      ),
      initialValidators = Immutable.Map({
        "AnimalID"    : validateSelect({}),
        "IsDeleted"   : (value : any) => value === true ? undefined : "Must check this",
        "InvoiceDate" : validateDate,
        "TaxTotal"    : validateFloat({
          min : 200,
          max : 10000,
        }),
        "Total" : atLeastChars(3),
        "City"  : (value : any) => (
          String(value).includes(",") ? undefined : "It must include a comma (,)"
        ),
        "Vat": (value : any) => {
          const 
            acceptedList = [5, 9, 19],
            isOk = acceptedList.includes(Number(value));

          if (isOk) {
            return undefined;
          }

          return `Must be ${acceptedList.join(" or ")}`;
        },
        [itemsListName]: Immutable.Map(
          {
            "Name"    : atLeastChars(3),
            "Surname" : atLeastChars(7),
          },
        ),
      }),
      dispatch = useDispatch(),
      onSubmit : onSubmitFunc  = (values) => 
      {
        console.log("values.toJS()", values.toJS());

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              if (Math.random() < 0.3) {
                throw new Error("Simulated error");
              }
              dispatch(notify("Trimis cu succes"));
              resolve("");
            } catch (error) {
              dispatch(notifyError("Probleme cu rețeaua"));
              reject(error);
            }
          }, 2000);
        });
      },
      onSubmitError : onSubmitErrorFunc = useCallback((errors) => {
        const cb = (node : any) => dispatch(notifyWarning(node, { persistent: true }));
  
        return onErrors(cb)(errors);
      }, []),
      decorators : ImmutableFormDecorators = Immutable.Map({
        "Items.Age": ({ formData, nodes }) => {
          // console.group("Items.Age");
          // console.log("field", field);
          // console.log("formData", formData);
          // console.log("nodes", nodes);
          // console.log("value", value);
          // console.groupEnd("Items.Age");
          const 
            sumAges = () => {
              const 
                listName = String(nodes.first()),
                list = getArray(formData, listName),
                newValue = list.reduce((reduction, row) => {
                  const
                    currentAge =  getArrayRowFieldValue(row, "Age"),
                    numericAge = isNumeric(currentAge) ? parseFloat(String(currentAge)) : 0;

                  formData.updateIn(
                    ["derived", ...nodes, "NewAge"], 
                    (newAge : any = 0) => (newAge + 10) as any,
                  );

                  return reduction + numericAge;
                }, 0);

              return newValue;
            };
            
          formData.setIn(["derived", "sum"], sumAges());
        },
      }),
      ImmutableFormOptions : FormOptions = {
        initialValues,
        initialValidators, 
        onSubmitError,
        decorators,
      },
      formHandlers = useImmutableForm(ImmutableFormOptions, onSubmit),
      [ source, setSource ] = React.useState("management"),
      toggleJSONSource = () => {
        setSource((
          source === "management" ? "formState" : "management"
        ));
      },
      nameInput = useRef<HTMLInputElement>(null),
      focus = () => {
        if (nameInput && nameInput.current) {
          nameInput.current.focus();
        }
      },

      formError = formHandlers.management.get("formError"),
      isSubmitting = formHandlers.management.get("isSubmitting"),
      isDirty = formHandlers.management.get("dirtyFields")?.size !== 0;

    return (
      <FormContext.Provider value={formHandlers}>
        <form onSubmit={formHandlers.handleSubmit}>
          <FormPrompt dirty={isDirty} />
          <FormInner 
            focus={focus}
            formError={formError}
            formState={formHandlers.formState}
            hide={hide}
            isSubmitting={isSubmitting}
            nameInput={nameInput}
            setField={formHandlers.handleChange}
            toggle={toggle}
            toggleJSONSource={toggleJSONSource}
          /> 
          <ShowSum />     
          {
            NR_OF_ROWS > 10 ? null : (
              <JSONSyntaxFromData 
                data={formHandlers[source as keyof typeof formHandlers]} height={600}
              /> 
            )
          }  
        </form>
      </FormContext.Provider>
    );
  };

export default MyForm;
```

<!-- ## 1. simple form with all possible inputs and outputs, validations

## 2. simple array with 5 rows 

## 3. complex form with 1000 fields (big array of 200 rows)

## 4. Visualization matters:  

    1. if the fields are displayed, their value is verified 
    2. if they are hidden they will not be validated, but their values are kept

    # This is achieved using a sistem of complex references   -->

# Custom language

By default the library uses **english** language, as default. You can change this by setting the language and providing the corresponding object. 

## 🔠 Available languages:
1. English 
2. Romanian 

`If you want to provide translations for other languages, please check the examples at /words/ro.ts`

You must set this once, in the most upper component of your app:

```jsx
    import { setWords } from "react-immutable-form/words";
    import { romanianWords } from "react-immutable-form/words/ro";

    const 
        YourApp = () => {
            const
                ImmutableFormOptions = /* blablabla */, 
                onSubmit = /* blablabla */, 
                formHandlers = useImmutableForm(ImmutableFormOptions, onSubmit);

            return (
                <>
                <FormContext.Provider value={formHandlers}>
                    <form onSubmit={formHandlers.handleSubmit}>
                    {"...here the first form"}
                    </form>
                </FormContext.Provider>
                </>
            )
        },
        RootComponent = () => {
            // do it once
            React.useEffect(() => {
                setWords(romanianWords);
            }, []);

            return (
                <YourApp />
            )
        }
```
