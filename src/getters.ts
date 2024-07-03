import { PartialPick as ExtractRequestedValues, ImmutableFormSingleField, ImmutableFormState } from "./types";
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

  /**
 * Extracts values from an Immutable.js Map based on specified keys and returns them as a partial object of type T.
 * @param formState The Immutable.js Map representing the form state.
 * @param keys List of keys whose values need to be extracted from formState.
 * @returns A partial object of type T containing the extracted values.
 */
  getValues = <T, K extends keyof T>(formState: Immutable.Map<string, any>, keys: K[]): ExtractRequestedValues<T, K>  => {
    const result = {} as any;
  
    keys.forEach((key : any) => {
      const value = formState.getIn([key, "value"]) as T[keyof T] | undefined;
  
      if (typeof value !== "undefined") {
        result[key] = value; 
      }
    });
  
    return result as ExtractRequestedValues<T, K>;
  },

  getValue = <T>(formState: Immutable.Map<string, any>, key : keyof T): (keyof T) | undefined => {
    const 
      value = formState.getIn([key as string, "value"]) as keyof T;

    if (value !== undefined) {
      return value; 
    }

    return undefined;
  },


  immutableGetters = {
    getArrayRowFieldValue,
    getSingleField,
    getArray,
    getValue,
    getRequestedValues: getValues,
  };

export default immutableGetters;