/* eslint-disable new-cap */

import Immutable from "immutable";
import { ID_FieldName, INDEX_FieldName, ImmutableFormState, Nodes } from "../types";
import { FieldEventRegisterFieldAction } from "../types-actions";
import { REFERENCES_PATH, getDefaultField, getIndexPathForRowValues, getNodesFromString, getRealPath } from "../util";
  
/** @intern */
type fieldRegisterGenericWrapperOptions = {
  indexFieldName: INDEX_FieldName;
  idFieldName : ID_FieldName;
  nodes: Nodes;
  /*** 
   * it is Immutable.withMutations
   */
  formDataWithMutations : ImmutableFormState; 
}

/** @intern */
export class FieldRegisterUpdaters {
  static stateUpdater = (options : fieldRegisterGenericWrapperOptions) => {
    const 
      { nodes, formDataWithMutations, idFieldName, indexFieldName } = options,
      isOneNode = nodes.size === 1,
      formState = formDataWithMutations.get("state"),
      handleOneNode = () => {
        if (formState.hasIn(nodes)) {
          return formState;
        }
        
        return formState.setIn(nodes, getDefaultField(idFieldName, ""));
      },
      handleList = () => {
        const 
          pathWithIndex = getIndexPathForRowValues(indexFieldName);

        if (formState.hasIn(pathWithIndex)) {
          return formState;
        }

        return formState.setIn(pathWithIndex, getDefaultField(idFieldName, ""));
      },
      getNewState = () => {
        if (isOneNode) {
          return handleOneNode();
        }
    
        return handleList();
      };

    formDataWithMutations.set("state", getNewState());
  };

  static managementUpdater = (options : fieldRegisterGenericWrapperOptions) => {
    const 
      { nodes, formDataWithMutations, idFieldName, indexFieldName } = options,
      newFormState = formDataWithMutations.get("state"),
      getNewManagement = (givenState: Immutable.Map<string, any>) => {
        const 
          managementPath = [...nodes, REFERENCES_PATH],
          hasInMemory = givenState.hasIn(nodes),
          handleHasInMemory = () => {
            const 
              updateDirtyFields = (dirtyFields : Immutable.Set<string>) => {
                const 
                  indexNodes = getRealPath(getNodesFromString(indexFieldName)),
                  formPath = [...indexNodes, "meta", "isDirty"],
                  isDirty = newFormState.getIn(formPath);

                if (isDirty) {
                  return dirtyFields.add(idFieldName);
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

    formDataWithMutations.update("management", getNewManagement);
  };
}

/** @intern */
export const 
  handleRegisterField= (formData : ImmutableFormState, action : FieldEventRegisterFieldAction) => {
    const 
      { idFieldName, indexFieldName } = action.payload,
      formDataUpdater = (formDataWithMutations : ImmutableFormState) => {
        const 
          nodes = getRealPath(getNodesFromString(idFieldName)),
         
          options : fieldRegisterGenericWrapperOptions = {
            nodes,
            idFieldName,
            indexFieldName, 
            formDataWithMutations,
          },
          updaters = [
            FieldRegisterUpdaters.stateUpdater,
            FieldRegisterUpdaters.managementUpdater,
          ];

        updaters.forEach((updater) => updater(options));
      };

    return formData.withMutations(formDataUpdater);
  };