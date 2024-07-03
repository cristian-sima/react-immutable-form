/* eslint-disable new-cap */
import Immutable from "immutable";
import { ID_FieldName, ImmutableFormState, ImmutableFormValidators, InitialValues, Nodes, ValidationResult } from "./types";

export const 
  /**
   * The default error that can be returned by onSubmit 
   * @see onSubmit
   * 
   */
  FORM_ERROR = "REACT_IMMUTABLE_FORM/error",

  /**
   * The field name for the references in the management state
   * 
   *  @internal 
   */
  REFERENCES_PATH = "REFERENCES",

  /**
   * The field name for the value in the arrays
   * 
   *  @internal 
   */
  ARRAY_VALUES_FIELD = "VALUES",
  
  /**
   * The default value when there is no error
   * 
   *  @internal 
   */
  DEFAULT_VALUE_NO_ERROR = undefined,

  /**
   * Converts a dot-separated string representation of nodes into an ImmutableJS List.
   *
   * This function takes a dot-separated string representation of nodes and converts it into
   * an ImmutableJS List.
   *
   * @param name - The dot-separated string representation of nodes.
   * @returns An ImmutableJS List representing the nodes.
   * @internal
   */
  getNodesFromString = (name: string) => (
    Immutable.fromJS(
      String(name).split("."),
    ) as Nodes
  ),

  /**
   * Adjusts a path represented by nodes to include the ARRAY_VALUES_FIELD if necessary.
   *
   * This function checks if the path represented by nodes contains only one node. If it does,
   * it returns the nodes unchanged. Otherwise, it inserts the ARRAY_VALUES_FIELD node at the second
   * to last position to adjust the path.
   *
   * @param nodes - The ImmutableJS List representing the nodes of the path.
   * @returns An adjusted ImmutableJS List representing the real path.
   * @internal
   */
  getRealPath = (nodes : Nodes) => (
    nodes.size === 1 ? nodes : (
      nodes.insert(nodes.size - 1, ARRAY_VALUES_FIELD)
    )
  ),

  /**
   * Creates a default field configuration.
   *
   * This function creates a default field configuration as an Immutable Map, including
   * the specified name, value, and optional idFieldName. It also initializes metadata fields.
   *
   * @param name - The name of the field.
   * @param value - The value of the field.
   * @param idFieldName - The idFieldName of the field (optional, defaults to the name).
   * @returns A default field configuration as an Immutable Map.
   * @internal
   */
  getDefaultField = (indexFieldName : string, value: string, idFieldName : ID_FieldName = indexFieldName as ID_FieldName) => (
    Immutable.Map({
      idFieldName,
      value,
      meta: Immutable.Map({
        isTouched    : false,
        theError     : DEFAULT_VALUE_NO_ERROR,
        isFocused    : false,
        initialValue : value,
        isDirty      : false,
      }),
    })
  ),

  /**
   * Creates row values for a specific ID within a target map, using the provided list name.
   * @param ID The identifier for the row.
   * @param target The target map containing existing data.
   * @param listName The name of the list containing the rows.
   * @returns An Immutable.Map containing the row values.
   * @internal
   */
  createRowValues = (ID: string, target: Immutable.Map<string, any>, listName : string) => Immutable.Map((
    target.reduce((rowAcc, rowFieldDefaultValue, indexFieldName) => {
      const 
        idFieldName = `${listName}.${ID}.${indexFieldName}` as ID_FieldName,
        givenValue = rowFieldDefaultValue || "",
        rowField = getDefaultField(indexFieldName, givenValue, idFieldName);

      return (
        rowAcc.set(indexFieldName, rowField)
      );
    }, Immutable.Map() as InitialValues)
  )),


  /**
   * Creates a row with specified ID within a target map, using the provided list name.
   * @param ID The identifier for the row.
   * @param target The target map containing existing data.
   * @param listName The name of the list containing the rows.
   * @returns An Immutable.Map representing the created row.
   * @internal
   */
  createRow = (ID: string, target: Immutable.Map<string, any>, listName : string) => (
    Immutable.Map(
      {
        ID,
        [ARRAY_VALUES_FIELD]: createRowValues(ID, target, listName),
      },
    )
  ),
  /**
   * Performs validation using the provided validators and nodes on a value to check within the entire form state.
   * @param validators ImmutableFormValidators containing validation functions.
   * @param nodes Nodes to search within the validators for the validation function.
   * @param valueToCheck The value to check for validation.
   * @param entireFormState The entire form state for contextual validation.
   * @returns The validation result.
   * @internal
   */
  performValidation = (validators : ImmutableFormValidators, nodes : Nodes, valueToCheck : any, entireFormState : ImmutableFormState) => {
    const 
      validatorNodes = nodes.size === 1 ? [nodes.first()] : (
        [nodes.first(), nodes.last()]
      ),
      validator = validators.getIn(validatorNodes);

    if (typeof validator === "function") {
      return validator(valueToCheck, entireFormState) as ValidationResult;
    }

    return DEFAULT_VALUE_NO_ERROR;
  },
  
  /**
   * Inserts a new element representing an array value field at the specified position in a dot-separated list.
   * @param dotList A string representing a dot-separated list.
   * @returns An array containing the elements of the dot-separated list with the new element added at the specified position.
   *  @internal
   */
  getIndexPathForRowValues = (dotList : string) => {
    const 
      position = -1,
      newElement = ARRAY_VALUES_FIELD,
      theList = dotList.split(".");

    theList.splice(position, 0, newElement);
    return theList;
  };