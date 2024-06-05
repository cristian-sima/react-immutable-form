/* eslint-disable new-cap */

import Immutable from "immutable";
import { ImmutableFormState } from "../types";
import { FieldEventUnregisterFieldAction } from "../types-actions";
import { REFERENCES_PATH, getNodesFromString, getRealPath } from "../util";


export const 
  handleUnregisterField= (formData : ImmutableFormState, action : FieldEventUnregisterFieldAction) => {
    const 
      // formState = formData.get("state"),
      { field } = action.payload,
      getNewManagement = (management : Immutable.Map<string, any>) => {
    
        const 
          nodes = getRealPath(getNodesFromString(field)),
          performDirtyUpdate = (dirtyFields : Immutable.Set<string>) => 
            dirtyFields.delete(field),
          checkDirty = (givenState : Immutable.Map<string, any>) => (
            givenState
              .update("dirtyFields", performDirtyUpdate)
          );
            
        if (management.hasIn(nodes)) {
          const path = [...nodes, REFERENCES_PATH];

          if (management.getIn(path) === 1) {
            if (nodes.size === 1) {
              return management.
                deleteIn(nodes).
                withMutations(checkDirty);
            }
                
            const
              parentNodes = nodes.slice(0, -1),
              parentNode = management.getIn(parentNodes) as Immutable.Map<string, any>,
              hasParents = parentNode.size === 1;

            if (hasParents) {
              return management.
                deleteIn(parentNodes.slice(0, -1)).
                withMutations(checkDirty);
            }
              
            return management.
              deleteIn(nodes).
              withMutations(checkDirty);
          }

          return management.
            updateIn([...nodes, REFERENCES_PATH], (value: any) => value - 1).
            withMutations(checkDirty);
        }
        return management;
      };

    return formData.update("management", getNewManagement);
  };