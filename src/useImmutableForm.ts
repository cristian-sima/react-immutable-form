/* eslint-disable max-lines */

import Immutable from "immutable";
import React, { useCallback } from "react";
import { getInitialState, reducer } from "./reducers";
import { FormOptions, ID_FieldName, INDEX_FieldName, ImmutableFormHandlers, ImmutableFormValidatorFunc, onSubmitFunc } from "./types";
import { handleManagementChanged } from "./useImmutableForm-handleManagementChanged";
import { getDefaultField } from "./util";
import { generateUniqueUUIDv4 } from "./uuid";

const 
  /**
   * Custom hook to handle form logic and to create a react-immutable-form
   * 
   * @param {FormOptions} options - The configuration options for the form.
   * @param {onSubmitFunc} onSubmit - The function to handle form submission.
   * @returns {FormInterface} The form interface to manage form state and actions.
   */
  useImmutableForm = (options : FormOptions, onSubmit: onSubmitFunc) => {
    const 
      initialState = React.useMemo(() => getInitialState(options), []),
      [formData, dispatchFormAction] = React.useReducer(reducer, initialState),

      formState = formData.get("state") as Immutable.Map<string, any>,
      management = formData.get("management") as Immutable.Map<string, any>,

      /**
     * Set the validator function for a specific form field.
     * 
     * @function setFieldValidator
     * @param {ID_FieldName} idFieldName - The ID of the field for which the validator is being set.
     * @param {ImmutableFormValidatorFunc} value - The validator function to be set for the field.
     * @returns {void}
     */
      setFieldValidator = useCallback((idFieldName: ID_FieldName, value : ImmutableFormValidatorFunc) => {
        dispatchFormAction({
          type    : "form-set-field-validator",
          payload : {
            idFieldName, 
            value,
          },
        });
      }, [dispatchFormAction]),

      /**
       * Get the entire form data.
       * 
       * @function getFormData
       * @returns {Immutable.Map<string, any>} The form data as an Immutable Map.
       */
      getFormData = useCallback(() => (
        formData as  Immutable.Map<string, any>
      ), [formData]),

      /**
       * Get the state of a specific field in the form.
       * 
       * @function getFieldState
       * @param {string} fieldName - The name of the field whose state is being retrieved.
       * @returns {Immutable.Map<string, any>} The state of the specified field as an Immutable Map.
       */
      getFieldState = useCallback((fieldName : string) => (
        (formData.getIn(["state", fieldName]) || getDefaultField(fieldName, "")) as Immutable.Map<string, any>
      ),  [formData]),

      /**
     * Handle change events for a form field.
     * 
     * @function handleChange
     * @param {string} idFieldName - The ID of the field that is being changed @see ID_FieldName
     * @param {any} value - The new value for the field.
     * @param {INDEX_FieldName} [indexFieldName=idFieldName] - The index of the field, if applicable.  @see INDEX_FieldName
     * @returns {void}
     */
      handleChange = useCallback((idFieldName : string, value : any, indexFieldName = idFieldName as unknown as INDEX_FieldName) => {
        dispatchFormAction({
          type    : "field-event-onChange",
          payload : {
            indexFieldName,
            idFieldName: idFieldName as ID_FieldName,
            value,
          },
        });
      }, [dispatchFormAction]),

      /**
     * Handle focus event for a form field.
     * 
     * @function handleFocus
     * @param {ID_FieldName} idFieldName - The ID of the field being focused.
     * @param {INDEX_FieldName} indexFieldName - The index of the field being focused.
     */
      handleFocus = useCallback((idFieldName : ID_FieldName, indexFieldName : INDEX_FieldName) => {
        dispatchFormAction({
          type    : "field-event-onFocus",
          payload : {
            idFieldName,
            indexFieldName,
          },
        });
      }, [dispatchFormAction]),

      /**
       * Handle blur event for a form field.
       * 
       * @function handleBlur
       * @param {ID_FieldName} idFieldName - The ID of the field being blurred.
       * @param {INDEX_FieldName} indexFieldName - The index of the field being blurred.
       */
      handleBlur = useCallback((idFieldName : ID_FieldName, indexFieldName : INDEX_FieldName) => {
        dispatchFormAction({
          type    : "field-event-onBlur",
          payload : {
            idFieldName,
            indexFieldName,
          },
        });
      }, [dispatchFormAction]),

      /**
     * Register a form field.
     * 
     * @function registerField
     * @param {ID_FieldName} idFieldName - The ID of the field being registered.
     * @param {INDEX_FieldName} indexFieldName - The index of the field being registered.
     */
      registerField = useCallback((idFieldName : ID_FieldName, indexFieldName : INDEX_FieldName) => {
        dispatchFormAction({
          type    : "field-event-registerField",
          payload : {
            idFieldName,
            indexFieldName,
          },
        });
      }, [dispatchFormAction]),

      /**
     * Unregister a form field.
     * 
     * @function unregisterField
     * @param {ID_FieldName} idFieldName - The ID of the field being unregistered.
     * @param {INDEX_FieldName} indexFieldName - The index of the field being unregistered.
     */
      unregisterField = useCallback((idFieldName : ID_FieldName, indexFieldName: INDEX_FieldName) => {
        dispatchFormAction({
          type    : "field-event-unregisterField",
          payload : {
            idFieldName,
            indexFieldName,
          },
        });
      }, [dispatchFormAction]),

      /**
       * Handle the addition of an item to an array field.
       * 
       * @function handleArrayAdd
       * @param {string} listName - The name of the array field.
       * @param {Immutable.Map<string, any>} [data=Immutable.Map<string, any>()] - The data to add to the array.
       */
      handleArrayAdd = useCallback((listName : string, data = Immutable.Map<string, any>()) => {
        dispatchFormAction({
          type    : "array-event-add",
          payload : {
            ID: generateUniqueUUIDv4(),
            listName,
            data,
          },
        });
      }, [dispatchFormAction]),

      /**
       * Handle the removal of an item from an array field.
       * 
       * @function handleArrayRemove
       * @param {string} listName - The name of the array field.
       * @param {string} ID - The ID of the item to remove from the array.
       */
      handleArrayRemove = useCallback((listName : string, ID : string) => {
        dispatchFormAction({
          type    : "array-event-remove",
          payload : {
            listName,
            ID,
          },
        });
      }, [dispatchFormAction]),

      /**
     * Indicate that form submission has been handled.
     * 
     * @function formSubmitHandled
     */
      formSubmitHandled = useCallback(() => {
        dispatchFormAction({
          type: "form-event-submitHandled",
        });
      }, [dispatchFormAction]),

      /**
       * Set the form's submission state.
       * 
       * @function formSetIsSubmitting
       * @param {boolean} isSubmitting - Whether the form is currently submitting.
       * @param {string} [error] - An error message, if any.
       */
      formSetIsSubmitting = useCallback((isSubmitting : boolean, error?: string) => {
        dispatchFormAction({
          type    : "form-set-isSubmitting",
          payload : {
            error,
            isSubmitting,
          },
        });
      }, [dispatchFormAction]),

      /**
     * Handle form submission.
     * 
     * @function handleSubmit
     * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
     */
      handleSubmit =  useCallback((event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        dispatchFormAction({
          type: "form-event-onSubmit",
        });

      }, [dispatchFormAction]),

      api = React.useMemo(() => {
        const inner :ImmutableFormHandlers = {
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

          formSubmitHandled,
          formSetIsSubmitting,
        };
        
        return inner; 
      }, [formState, management]);

    React.useEffect(handleManagementChanged(api, options, {
      dispatchFormAction,
      onSubmit,
    }), [management]);

    return api;
  };

export default useImmutableForm;