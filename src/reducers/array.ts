/* eslint-disable new-cap */

import Immutable from "immutable";
import { ArrayEventAdd, ArrayEventRemove } from "../types-actions";
import { createRow } from "../util";

export type ImmutableFormState = Immutable.Map<string, any>;

export const 
  handleArrayAddAction = (state : ImmutableFormState, action : ArrayEventAdd) => {
    const 
      { data, listName, ID  } = action.payload,
      getNewFormState = (formState : Immutable.Map<string, any>) => {
        const listUpdater = (list = Immutable.List<Immutable.Map<string, any>>()) => {
          const 
            newRow = createRow(ID, data, listName);
        
          return list.push(newRow);
        };

        return formState.update(listName, listUpdater);
      };

    return state.update("state", getNewFormState);
  },
  handleArrayRemoveAction = (state : ImmutableFormState, action : ArrayEventRemove) => {
    const 
      { ID, listName } = action.payload,
      getNewFormState = (formState : Immutable.Map<string, any>) =>  {
        const listUpdater = (data: Immutable.List<Immutable.Map<string, any>>) => {
          if (typeof data === "undefined") {
            return data;
          }
          
          const index = data.findIndex((current: Immutable.Map<string, any>) => (
            current.get("ID") === ID
          ));

          if (index === -1) {
            return data;
          }

          return data.delete(index);
        };

        return formState.update(listName, listUpdater);
      };

    return state.update("state", getNewFormState);
  };