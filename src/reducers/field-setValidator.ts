import Immutable from "immutable";
import { ImmutableFormState } from "./array";
import { FormSetFieldValidator } from "src/types-actions";
import { getNodesFromString, getRealPath } from "src/util";

export const 
  fieldSetValidator = (state : ImmutableFormState, action : FormSetFieldValidator) => {
    const 
      { field, value  } = action.payload,
      validatorUpdater = (formState : Immutable.Map<string, any>) => {
        if (!formState) {
          return formState;
        }

        const  
          nodes = getRealPath(getNodesFromString(field)),
          handleList = () => {
            const 
              listName = nodes.first(),
              fieldName = nodes.last(),
              path = ["validators", listName, fieldName];

            return state.setIn(path, value);
          };

        if (nodes.size === 1) {
          return state.setIn(["validators", field], value);
        }

        return handleList();
      };

    return state.update("state", validatorUpdater);
  };