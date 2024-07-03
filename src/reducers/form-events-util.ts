
import Immutable from "immutable";
import { ValidationResult, updateValuesStateOptions, verifyAllItemsFuncOptions } from "../types";
import { ARRAY_VALUES_FIELD, REFERENCES_PATH, getNodesFromString, getRealPath, performValidation } from "../util";


export const 

  /** @intern */
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

  /** @intern */
  verifyAllItems = (verifyOptions : verifyAllItemsFuncOptions) => {
    
    let 
      errors = Immutable.Map<string, any>(),
      values = Immutable.Map<string, any>();
    
    const 
      { validators, formState, management } = verifyOptions,
      verifyItem = (item : Immutable.Map<string, any>, fieldKey : string  ) => {
        const 
          rawNodes = getNodesFromString(fieldKey),
          nodes = getRealPath(rawNodes),
          value = item.get("value"),
          validatorErr = performValidation(validators, nodes, value, formState) as ValidationResult,
          hasError = validatorErr !== undefined,
          valuesOptions = { fieldKey, nodes, whatToSet: value } as updateValuesStateOptions;
        
        values = updateValuesState(values, valuesOptions);

        if (hasError) {
          errors = errors.setIn(rawNodes, validatorErr);

          return item.withMutations((state) => {
            state.mergeDeepIn(["meta"], Immutable.fromJS({
              isTouched : true,
              theError  : validatorErr,
            }));
          });
        }

        return item;
      },
      
      newFormState = (
        formState.withMutations((givenFormState) => {
          givenFormState.forEach((item: Immutable.Map<string, any>, fieldKey) => {
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
                            idFieldName = rowField.get("idFieldName"), managementNodes = getRealPath(getNodesFromString(idFieldName)), hasReferences = management.hasIn(managementNodes);

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
                      item.get("meta") && hasReference
                    );

                  if (shouldCheck) {
                    return verifyItem(item, fieldKey);
                  }
                  
                  return item;
                };

              if (Immutable.List.isList(item)) {
                return checkList(item as Immutable.List<Immutable.Map<string, any>>, fieldKey);
              }

              if (Immutable.Map.isMap(item)) {
                return checkMap();
              }

              return item;
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