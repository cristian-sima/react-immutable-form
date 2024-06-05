
import Immutable from "immutable";
import { ImmutableFormState, ImmutableFormValidators, ManagementState, Nodes, ValidationResult } from "../types";
import { ARRAY_VALUES_FIELD, REFERENCES_PATH, getNodesFromString, getRealPath, performValidation } from "../util";

type verifyAllItemsFuncOptions = {
  validators: ImmutableFormValidators;
  formState: ImmutableFormState;
  management: ManagementState;
}

type updateValuesStateOptions = {
  whatToSet : any;
  fieldKey : string;
  nodes: Nodes;
}

export const 
  updateValuesState = (givenValues : Immutable.Map<string, any>, options : updateValuesStateOptions) => {
    const 
      { fieldKey, nodes, whatToSet } = options,
      setValueForSingleNodes = () => (
        givenValues.set(fieldKey, whatToSet)
      ),
      setValueForArrays = () => {
        const
          listName = nodes.first() as string,
          index = nodes.get(1),
          fieldName = nodes.last(),
          arrayUpdater = (theList = Immutable.List<any>()) => (
            theList.setIn([index, fieldName], whatToSet)
          );

        return givenValues.update(listName, arrayUpdater);
      };
  
    if (nodes.size === 1) {
      return setValueForSingleNodes();
    }

    return setValueForArrays();
  },
  verifyAllItems = (verifyOptions : verifyAllItemsFuncOptions) => {
    
    let 
      errors = Immutable.Map<string, any>(),
      values = Immutable.Map<string, any>();
    
    const 
      { validators, formState, management } = verifyOptions,
      verifyItem = (field : Immutable.Map<string, any> , fieldKey : string  ) => {
        const 
          rawNodes = getNodesFromString(fieldKey),
          nodes = getRealPath(rawNodes),
          value = field.get("value"),
          validatorErr = performValidation(validators, nodes, value, formState) as ValidationResult,
          hasError = validatorErr !== undefined,
          valuesOptions = { fieldKey, nodes, whatToSet: value } as updateValuesStateOptions;
        
        values = updateValuesState(values, valuesOptions);

        if (hasError) {
          errors = errors.setIn(rawNodes, validatorErr);

          return field.withMutations((state) => {
            state.mergeDeepIn(["meta"], Immutable.fromJS({
              isTouched : true,
              theError  : validatorErr,
            }));
          });
        }

        return field;
      },
      
      newFormState = (
        formState.withMutations((givenFormState) => {
          givenFormState.forEach((field: Immutable.Map<string, any>, fieldKey) => {
            const getNewValue = () => {
              const
                checkRow = (items: Immutable.List<Immutable.Map<string, any>>, listName: string, rowIndex: number) => (
                  items.withMutations((itemsState) => {
                    itemsState.forEach((rowField, rowFieldName) => {

                      const getNewItem = () => {
                        const shouldCheck = (
                          Immutable.Map.isMap(rowField) &&
                                              rowField.get("meta")
                        );

                        if (shouldCheck) {
                          const
                            managementPath = rowField.get("path"), managementNodes = getRealPath(getNodesFromString(managementPath)), hasReferences = management.hasIn(managementNodes);

                          if (!hasReferences) {
                            return rowField;
                          }

                          const
                            statePath = `${listName}.${rowIndex}.${rowFieldName}`, fieldResult = verifyItem(rowField, statePath);

                          return fieldResult;
                        }

                        return rowField;
                      };

                      itemsState.set(rowFieldName, getNewItem());
                    });
                  })
                ),
                checkList = (theList: Immutable.List<Immutable.Map<string, any>>, listName: string) => (
                  theList.withMutations((givenList) => {
                    givenList.forEach((row: Immutable.Map<string, any>, rowIndex) => {
                      const
                        getNewRowValue = () => {
                          const
                            theItems = row.get(ARRAY_VALUES_FIELD) as Immutable.List<Immutable.Map<string, any>>, rowResult = checkRow(theItems, listName, rowIndex);

                          return row.set(ARRAY_VALUES_FIELD, rowResult);
                        };

                      givenList.set(rowIndex, getNewRowValue());
                    });
                  })
                ),
                checkMap = () => {
                  const
                    hasReference = management.hasIn([fieldKey, REFERENCES_PATH]),
                    shouldCheck = (
                      field.get("meta") && hasReference
                    );

                  if (shouldCheck) {
                    return verifyItem(field, fieldKey);
                  }
                  
                  return field;
                };

              if (Immutable.List.isList(field)) {
                return checkList(field as Immutable.List<Immutable.Map<string, any>>, fieldKey);
              }

              if (Immutable.Map.isMap(field)) {
                return checkMap();
              }

              return field;
            };

            givenFormState.set(fieldKey, getNewValue());
          });
        })
      );

    return {
      newFormState,
      errors,
      values,
    };
  };