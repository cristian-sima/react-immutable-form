import Immutable from "immutable";
import { FormSetFieldValidator } from "../types-actions";
import { getNodesFromString, getRealPath } from "../util";
import { ImmutableFormState } from "./array";

export const 
  fieldSetValidator = (state : ImmutableFormState, action : FormSetFieldValidator) => {
    const 
      { idFieldName, value  } = action.payload,
      validatorUpdater = (formState : Immutable.Map<string, any>) => {
        if (!formState) {
          return formState;
        }

        const  
          nodes = getRealPath(getNodesFromString(idFieldName)),
          handleList = () => {
            const 
              listName = nodes.first(),
              fieldName = nodes.last(),
              path = ["validators", listName, fieldName];

            return state.setIn(path, value);
          };

        if (nodes.size === 1) {
          return state.setIn(["validators", idFieldName], value);
        }

        return handleList();
      };

    return state.update("state", validatorUpdater);
  };