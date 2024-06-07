import Immutable from "immutable";
import { ImmutableFormState } from "./array";
import { FieldEventOnFocusAction } from "src/types-actions";
import { getDefaultField, getNodesFromString, getRealPath } from "src/util";

export const 
  handleOnFocus = (state : ImmutableFormState, action : FieldEventOnFocusAction) => {
    const 
      { field } = action.payload,
      stateUpdater = (formState : Immutable.Map<string, any>) => {
        const 
          elementNodes = getRealPath(getNodesFromString(field)),
          theNode = formState.getIn(elementNodes) as Immutable.Map<string, any> | undefined,
          focusedNodes = Immutable.List(["meta", "isFocused"]),
          hasTheNode = () => (
            formState.setIn([...elementNodes, ...focusedNodes], true)
          ),
          doesNotHaveTheNode = () => {
            const 
              newElementValue = getDefaultField(field, "").setIn(focusedNodes, false);

            return formState.setIn(elementNodes, newElementValue);
          };

        if (theNode) {
          return hasTheNode();
        }

        return doesNotHaveTheNode();
      };

    return state.update("state", stateUpdater);
  };