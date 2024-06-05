import { ImmutableFormSingleField, ImmutableFormState } from "./types";
import { ARRAY_VALUES_FIELD } from "./util";

const    
/**
 * Retrieves the value of a specified field from a given row, for an array
 * 
 * @param {Immutable.Map<string, any>} row - The row from which to retrieve the field value.
 * @param {string} fieldName - The name of the field to retrieve the value from.
 * @returns {string | undefined} - The value of the specified field, or undefined if not found.
 */ 
  getArrayRowFieldValue = (row : Immutable.Map<string, any>, fieldName : string) => (
    row.getIn([ARRAY_VALUES_FIELD, fieldName, "value"]) as string | undefined
  ),
  /**
     * Retrieves a specified field from the form data.
     * 
     * @param {ImmutableFormState} formData - The form data object.
     * @param {string} fieldName - The name of the field to retrieve.
     * @returns {ImmutableFormSingleField} - The field data.
     */
  getSingleField = (formData : ImmutableFormState, fieldName : string) => (
    formData.getIn(["state", fieldName]) as ImmutableFormSingleField
  ),
  /**
 * Retrieves a specified array field from the form data.
 * 
 * @param {ImmutableFormState} formData - The form data object.
 * @param {string} fieldName - The name of the array field to retrieve.
 * @returns {ImmutableFormState} - The array field data.
 */  
  getArray = (formData : ImmutableFormState, fieldName : string) => (
    formData.getIn(["state", fieldName]) as ImmutableFormState
  ),
  immutableGetters = {
    getArrayRowFieldValue,
    getSingleField,
    getArray,
  };

export default immutableGetters;