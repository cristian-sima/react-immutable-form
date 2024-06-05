/* eslint-disable new-cap */

import Immutable from "immutable";
import { ImmutableFormState } from "../types";
import { FieldEventOnFocusAction } from "../types-actions";
import { getDefaultField, getNodesFromString, getRealPath } from "../util";


export const 
  handleOnFocus = (state : ImmutableFormState, action : FieldEventOnFocusAction) => {
    const 
      { field } = action.payload,
      stateUpdater = (formState : Immutable.Map<string, any>) => {
        const 
          elementNodes = getRealPath(getNodesFromString(field)),
          theNode = formState.getIn(elementNodes) as Immutable.Map<string, any> | undefined,
          focusedNodes = Immutable.List(["meta", "isFocused"]);

        if (theNode) {
          return formState.setIn([...elementNodes, ...focusedNodes], true);
        }

        const newElementValue = getDefaultField(field, "").setIn(focusedNodes, false);

        return formState.setIn(elementNodes, newElementValue);
      };

    return state.update("state", stateUpdater);
  };