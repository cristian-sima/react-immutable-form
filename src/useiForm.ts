/* eslint-disable max-lines */

import Immutable from "immutable";
import React, { useCallback } from "react";
import { getInitialState, reducer } from "./reducers";
import { FormOptions, iFormValidatorFunc, onSubmitFunc } from "./types";
import { FORM_ERROR, getDefaultField } from "./util";
import { getWords } from "./words";

export const 
  /**
   * Custom hook to handle form logic.
   * 
   * @param {FormOptions} options - The configuration options for the form.
   * @param {onSubmitFunc} onSubmit - The function to handle form submission.
   * @returns {FormInterface} The form interface to manage form state and actions.
   */
  rawUseiForm = (options : FormOptions, onSubmit: onSubmitFunc) => {
    const 
      initialState = React.useMemo(() => getInitialState(options), []),
      [formData, dispatchFormAction] = React.useReducer(reducer, initialState),

      formState = formData.get("state") as Immutable.Map<string, any>,
      management = formData.get("management") as Immutable.Map<string, any>,

      setFieldValidator = useCallback((field: string, value : iFormValidatorFunc) => {
        dispatchFormAction({
          type    : "form-set-field-validator",
          payload : {
            field, 
            value,
          },
        });
      }, [dispatchFormAction]),
      
      getFormData = useCallback(() => (
        formData as  Immutable.Map<string, any>
      ), [formData]),

      getFieldState = useCallback((field : string) => (
        (formData.getIn(["state", field]) || getDefaultField(field, "")) as Immutable.Map<string, any>
      ),  [formData]),

      handleChange = useCallback((field : string, value : any) => {
        dispatchFormAction({
          type    : "field-event-onChange",
          payload : {
            field,
            value,
          },
        });
      }, [dispatchFormAction]),

      handleFocus = useCallback((field : string) => {
        dispatchFormAction({
          type    : "field-event-onFocus",
          payload : {
            field,
          },
        });
      }, [dispatchFormAction]),

      handleBlur = useCallback((field : string) => {
        dispatchFormAction({
          type    : "field-event-onBlur",
          payload : {
            field,
          },
        });
      }, [dispatchFormAction]),

      registerField = useCallback((field : string) => {
        dispatchFormAction({
          type    : "field-event-registerField",
          payload : {
            field,
          },
        });
      }, [dispatchFormAction]),

      unregisterField = useCallback((field : string) => {
        dispatchFormAction({
          type    : "field-event-unregisterField",
          payload : {
            field,
          },
        });
      }, [dispatchFormAction]),

      handleArrayAdd = useCallback((listName : string, data = {}) => {
        dispatchFormAction({
          type    : "array-event-add",
          payload : {
            listName,
            data,
          },
        });
      }, [dispatchFormAction]),

      handleArrayRemove = useCallback((listName : string, ID : string) => {
        dispatchFormAction({
          type    : "array-event-remove",
          payload : {
            listName,
            ID,
          },
        });
      }, [dispatchFormAction]),

      formSubmitHandled = useCallback(() => {
        dispatchFormAction({
          type: "form-event-submitHandled",
        });
      }, [dispatchFormAction]),

      formSetIsSubmitting = useCallback((isSubmitting : boolean, error?: string) => {
        dispatchFormAction({
          type    : "form-set-isSubmitting",
          payload : {
            error,
            isSubmitting,
          },
        });
      }, [dispatchFormAction]),

      handleSubmit =  useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        dispatchFormAction({
          type: "form-event-onSubmit",
        });

      }, [dispatchFormAction]),

      validationResult = React.useMemo(() => ({
        // form
        formState,
        management,
        handleSubmit,
        getFormData,
        getFieldState,

        // array mutators
        handleArrayAdd,
        handleArrayRemove,
        
        // field mutators
        handleChange,
        handleFocus,
        handleBlur,
        setFieldValidator,
        registerField,
        unregisterField,
      }), [formState, management]);

    React.useEffect(() => {
      const 
        performSubmit = (values : Immutable.Map<string, any>, errors : Immutable.Map<string, any>) => {
          const               
            hasErrors = errors.size !== 0,
            setError = (err : string) =>  {
              formSetIsSubmitting(false, err);
            },
            handleNoError = () => {
              const 
                performForm = () => {
                  setTimeout(async () => {
                    try {
                      formSetIsSubmitting(true);

                      const requestResult = await onSubmit(values, dispatchFormAction);
      
                      if (requestResult === FORM_ERROR) {
                        setError("Form submission failed");
                      } else {
                        formSetIsSubmitting(false);
                      }
                    } catch (error) {
                      setError(getWords().SOMETHING_WENT_WRONG);
                    }
                  });
                };
  
              performForm();
            };
  
          if (hasErrors) {
            if (typeof options.onSubmitError === "function") {
              options.onSubmitError(errors, dispatchFormAction);
            }
          } else {
            try {
              handleNoError();
            } catch (err) {
              setError(getWords().SOMETHING_WENT_WRONG);
            } 
          }
        };

      if (management.get("readyToSubmit")) {
        const 
          values = management.get("values"),
          errors = management.get("errors");

        formSubmitHandled();
        performSubmit(values, errors);
      }
    }, [management]);

    return validationResult;
  };