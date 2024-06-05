/* eslint-disable new-cap */

import Immutable from "immutable";
import { ImmutableFormState, ImmutableFormValidators } from "../types";
import { FieldEventOnBlurAction } from "../types-actions";
import { getDefaultField, getNodesFromString, getRealPath, performValidation } from "../util";


export const 
  handleOnBlur = (formData : ImmutableFormState, action : FieldEventOnBlurAction) => {
    const 
      validators = formData.get("validators") as ImmutableFormValidators,
      { field } = action.payload,
      stateUpdater = (formState : Immutable.Map<string, any>) => {
        const 
          nodes = getRealPath(getNodesFromString(field)),
          value = formState.getIn([...nodes, "value"]),
          validatorErr = performValidation(validators, nodes, value, formState),
          theNode = formState.getIn(nodes) as Immutable.Map<string, any> | undefined,
          hasNode = () => (
            formState.withMutations((state) =>
              state.mergeDeepIn([...nodes, "meta"], Immutable.fromJS({
                isTouched : true,
                isFocused : false,
                theError  : validatorErr,
              })),
            )
          ),
          nodeIsNotPresent = () => {
            const elementDefaultValue = (
              getDefaultField(field, "").withMutations((state) => {
                state.mergeDeepIn(["meta"], Immutable.fromJS({
                  isFocused : false,
                  theError  : validatorErr,
                }));
              }) 
            );
    
            return formState.setIn(nodes, elementDefaultValue);
          };

        if (theNode) {
          return hasNode();
        }

        return nodeIsNotPresent();
      };

    return formData.update("state", stateUpdater);
  };