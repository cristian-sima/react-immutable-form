iForm - the **immutableJS form** library for react. Based on best library: Immutable.js

### Fast, scalable, efficient, predictable library

<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDQwMCAxNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIwJSI+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2MURBRkI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzQ5MDg2MTtzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxmaWx0ZXIgaWQ9ImYxIiB4PSIwIiB5PSIwIj4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIGluPSJTb3VyY2VHcmFwaGljIiBzdGREZXZpYXRpb249IjE1IiAvPgogICAgICAgIDwvZmlsdGVyPgogICAgPC9kZWZzPgogICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkMSkiIC8+CiAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MCw3NSkiPgogICAgICAgIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI0MCIgZmlsbD0id2hpdGUiIGZpbHRlcj0idXJsKCNmMSkiIC8+CiAgICAgICAgPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjMwIiBmaWxsPSIjNjFEQUZCIiAvPgogICAgICAgIDx0ZXh0IHg9IjAiIHk9IjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiCiAgICAgICAgICAgIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIj4KCiAgICAgICAgPC90ZXh0PgogICAgPC9nPgogICAgPHRleHQgeD0iMjQwIiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIKICAgICAgICBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSI+CiAgICAgICAgcmVhY3QtaW1tdXRhYmxlLWZvcm0KICAgIDwvdGV4dD4KPC9zdmc+" alt="react-immutable-form" style="width:100%; height:auto;" />

# Principles
**react-immutable-form** or **iForm** was build on these principals:

1. *efficiency* 
    - it updates `just the necessary fields`, doing it efficiently using Immutable.Js
    - it can handle `1000 inputs out-of-the-box`, without any optimization 
    - it `receives decorators` for computing additional states (eg. total of an invoice)
    - `instant feedback` for validation, submitting and other events
    - `smart-management` of the fields, using a complex system of references 
        - if the fields are `displayed`, their value `is verified `
        - if they are `hidden` they `will not be validated`, but `their values are kept`

2. *simplicity* - comes out-of-the-box with all the features you would want to use:
    - `full integration with arrays` (add rows, delete, etc) - using `uuid as keys`
    - *FocusPromt* - `warn the user` the form has unsaved changes
    - *ErrorDisplay* - shows the `errors in a friendly way`
    - `easy access` for the state
    - `simple API` for managing the inputs
    
3. *focused on normal cases* 
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

## Other features:
1. `Small size` of library 
2. `No extra dependencies` 

# Installation 

To install please run the following
react-immutable-form

# Examples

## 1. simple form with all possible inputs and outputs, validations

## 2. simple array with 5 rows 

## 3. complex form with 1000 fields (big array of 200 rows)

## 4. Visualization matters:  

    1. if the fields are displayed, their value is verified 
    2. if they are hidden they will not be validated, but their values are kept

    # This is achieved using a sistem of complex references  

# Custom language

By default the library uses **english** language, as default. You can change this by setting the language and providing the corresponding object. 

## Available languages:
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
                iFormOptions = /* blablabla */, 
                onSubmit = /* blablabla */, 
                formHandlers = useiForm(iFormOptions, onSubmit);

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

# FAQ

## If i have a nested array, how to handle it?

For nested structures, it is a good idea to normalize data and reduce it to one level of complexity. Working with deep structures is not a good practice for array. 