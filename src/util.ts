/* eslint-disable new-cap */
import Immutable, { List } from "immutable";
import { createContext } from "react";
import { FormInterface, InitialValues, Nodes, ValidationResult, iFormState, iFormValidators } from "./types";
import { generateUniqueUUIDv4 } from "./uuid";

export const 
  FORM_ERROR = "I_FORM/form-error",
  REFERENCES_PATH = "REFERENCES",
  ARRAY_VALUES_FIELD = "VALUES",
  DEFAULT_VALUE_NO_ERROR = undefined,

  FormContext = createContext<FormInterface>({} as any),

  getDefaultManagement = () => (
    Immutable.fromJS({
      dirtyFields: Immutable.Set<string>(),
    })
  ),
  getNodesFromString = (name: string) => (
    Immutable.fromJS(
      String(name).split("."),
    ) as Nodes
  ),
  getRealPath = (nodes : Nodes) => (
    nodes.size === 1 ? nodes : (
      nodes.insert(nodes.size - 1, ARRAY_VALUES_FIELD)
    )
  ),
  getDefaultField = (name : string, value: string, path : string = name) => (
    Immutable.Map({
      path,
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
  createRow = (ID: string, target: Immutable.Map<string, any>, listName : string) => {
    const
      parseRow = () => Immutable.Map((
        target.reduce((rowAcc, rowFieldDefaultValue, rowFieldName) => {
          const 
            path = `${listName}.${ID}.${rowFieldName}`,
            givenValue = rowFieldDefaultValue || "",
            rowField = getDefaultField(rowFieldName, givenValue, path);

          return (
            rowAcc.set(rowFieldName, rowField)
          );
        }, Immutable.Map() as InitialValues)
      ));

    return (
      Immutable.Map(
        {
          ID,
          [ARRAY_VALUES_FIELD]: parseRow(),
        },
      )
    );
  },
  performValidation = (validators : iFormValidators, nodes : Nodes, valueToCheck : any, prevState : iFormState) => {
    const 
      validatorNodes = nodes.size === 1 ? [nodes.first()] : (
        [nodes.first(), nodes.last()]
      ),
      validator = validators.getIn(validatorNodes);

    if (typeof validator === "function") {
      return validator(valueToCheck, prevState) as ValidationResult;
    }

    return DEFAULT_VALUE_NO_ERROR;
  },
  
  initialFieldState = (value: any, name : string) => {
    const
      processList = (rows : Immutable.List<any>, lisName : string) => (
        rows.
          reduce((acc, row: any) => {
            const
              ID = generateUniqueUUIDv4(),
              result = createRow(ID, row, lisName);

            return acc.push(result);
          }, Immutable.List<Immutable.Map<string, any>>())
      );

    if (List.isList(value)) {
      return Immutable.fromJS(
        processList(value as Immutable.List<any>, name),
      );
    }

    return getDefaultField(name, value);
  },
  parseInitialData = (target: InitialValues) => Immutable.Map(
    target.reduce((acc, value, key) => (
      acc.set(key, initialFieldState(value, key))
    ), Immutable.Map() as InitialValues),
  );