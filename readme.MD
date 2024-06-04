iForm - the **[i]mmutable form** library for react. Based on best library: Immutable.js

### Fast, scalable, efficient, predictable library

# Established principles:
iForm tries to achieve the following simple principals

1. *efficiency* 
    - it updates just the necessary fields, doing it efficiently using Immutable.Js
    - it can handle 1000 inputs out-of-the-box, without any optimization 
    - it receives decorators for computing additional states (eg. total of an invoice)
    - instant feedback for validation, submitting and other events

2. *simplicity* - comes out-of-the-box with all the features you would want to use:
    - full integration with arrays
    - *FocusPromt* - warn the user the form has unsaved changes
    - *ErrorDisplay* - shows the errors in a friendly way
    
3. *focused on normal cases* 
    - it handles the most common use cases, thus solving their key problems and removing the complexity of dealing with complex cases 
    - create your own custom field using *Field* and *FieldRender*
    - it provides out the box custom Inputs
        - *SimpleInput*         - it is a string input
        - *TemplateInput*       - used for input with a label
        - *NumericInput*        - used for numbers
        - *NumericTemplate*     - used for numeric input with a label
        - *SimpleTextarea*      - used for textarea
        - *TextareaTemplate*    - used for textarea with a label
        - *SimpleSelect*        - displays a select 
        - *SelectTemplate*      - a select input with a label

## Other features:
1. Small size of library 
2. No extra dependencies 

# Installation 

To install please run the following

``` npm install iForm```

# Examples

## 1. simple form with all possible inputs and outputs, validations

## 2. simple array with 5 rows 

## 3. complex form with 1000 fields (big array of 200 rows)

## 4. Visualization matters:  

    1. if the fields are displayed, their value is verified 
    2. if they are hidden they will not be validated, but their values are kept

    # This is achieved using a sistem of complex references  

# FAQ

## If i have a nested array, how to handle it?

For nested structures, it is a good idea to normalize data and reduce it to one level of complexity. Working with deep structures is not a good practice for array. 