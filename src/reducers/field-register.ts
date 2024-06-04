/* eslint-disable new-cap */

import Immutable from "immutable";
import { iFormState } from "../types";
import { FieldEventRegisterFieldAction } from "../types-actions";
import { ARRAY_VALUES_FIELD, REFERENCES_PATH, getDefaultField, getNodesFromString, getRealPath } from "../util";


export const 
  handleRegisterField= (formData : iFormState, action : FieldEventRegisterFieldAction) => {
    const 
      { field } = action.payload,
      getNewFormState = (formState : Immutable.Map<string, any>) => {
        const 
          nodes = getRealPath(getNodesFromString(field)),
          isOneNode = nodes.size === 1,
          handleOneNode = () => {
            if (formState.hasIn(nodes)) {
              return formState;
            }
              
            return formState.setIn(nodes, getDefaultField(field, ""));
          },
          handleList = () => {
            const 
              listName = nodes.first() as string,
              list = formState.get(listName) as Immutable.List<Immutable.Map<string, any>>;

            if (list) {
              const 
                idPosition = 1,
                id = nodes.get(idPosition) as string,
                fieldName = nodes.last() as string,
                index = list.findIndex((current) => current.get("ID") === id),
                pathWithIndex = [listName, index, ARRAY_VALUES_FIELD, fieldName];

              if (formState.hasIn(pathWithIndex)) {
                return formState;
              }

              return formState.setIn(pathWithIndex, getDefaultField(field, ""));
            }

            return formState;
          };

        if (isOneNode) {
          return handleOneNode();
        }

        return handleList();
      },
      getNewManagementState = (newFormData : Immutable.Map<string, any>) => {
        const 
          newFormState = newFormData.get("state"),
          updateReference = (givenState: Immutable.Map<string, any>) => {
            const 
              nodes = getRealPath(getNodesFromString(field)),
              managementPath = [...nodes, REFERENCES_PATH],
              hasInMemory = givenState.hasIn(nodes),
              handleHasInMemory = () => {
                const 
                  updateDirtyFields = (dirtyFields : Immutable.Set<string>) => {
                    const 
                      formPath = [...nodes, "meta", "isDirty"],
                      isDirty = newFormState.getIn(formPath);

                    if (isDirty) {
                      return dirtyFields.add(field);
                    }
  
                    return dirtyFields; 
                  };
  
                return (
                  givenState
                    .updateIn(managementPath, (value : any) => value ? value + 1 : 1)
                    .update("dirtyFields", updateDirtyFields)
                );
              },
              handleNotInMemory = () => (
                givenState.setIn(managementPath, 1)
              );
  
            if (hasInMemory) {
              return handleHasInMemory();
            }
  
            return handleNotInMemory();
          };
  
        return newFormData.update("management", updateReference);
      };

    return formData
      .update("state", getNewFormState)
      .update(getNewManagementState);
  };