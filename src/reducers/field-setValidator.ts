import Immutable from "immutable";
import { FormSetFieldValidator } from "../types-actions";
import { getNodesFromString, getRealPath } from "../util";
import { ImmutableFormState } from "./array";

export const 
  /** @intern */
  fieldSetValidator = (formState : ImmutableFormState, action : FormSetFieldValidator) => {
    const 
      { idFieldName, value  } = action.payload,
      validatorUpdater = (givenState : Immutable.Map<string, any>) => {
        if (!givenState) {
          return givenState;
        }

        const  
          nodes = getRealPath(getNodesFromString(idFieldName)),
          handleList = () => {
            const 
              listName = nodes.first(),
              fieldName = nodes.last(),
              path = [ listName, fieldName];

            return givenState.setIn(path, value);
          };

        if (nodes.size === 1) {
          return givenState.set(idFieldName, value);
        }

        return handleList();
      };

    return formState.update("validators", validatorUpdater);
  };