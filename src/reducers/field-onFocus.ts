import Immutable from "immutable";
import { FieldEventOnFocusAction } from "../types-actions";
import { getDefaultField, getNodesFromString, getRealPath } from "../util";
import { ImmutableFormState } from "./array";

export const 
  handleOnFocus = (state : ImmutableFormState, action : FieldEventOnFocusAction) => {
    const 
      { indexFieldName } = action.payload,
      stateUpdater = (formState : Immutable.Map<string, any>) => {
        const 
          elementNodes = getRealPath(getNodesFromString(indexFieldName)),
          theNode = formState.getIn(elementNodes) as Immutable.Map<string, any> | undefined,
          focusedNodes = Immutable.List(["meta", "isFocused"]),
          hasTheNode = () => (
            formState.setIn([...elementNodes, ...focusedNodes], true)
          ),
          doesNotHaveTheNode = () => {
            const 
              newElementValue = getDefaultField(indexFieldName, "").setIn(focusedNodes, false);

            return formState.setIn(elementNodes, newElementValue);
          };

        if (theNode) {
          return hasTheNode();
        }

        return doesNotHaveTheNode();
      };

    return state.update("state", stateUpdater);
  };