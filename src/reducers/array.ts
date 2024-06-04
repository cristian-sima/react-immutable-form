/* eslint-disable new-cap */

import Immutable from "immutable";
import { iFormState } from "../types";
import { ArrayEventAdd, ArrayEventRemove } from "../types-actions";
import { createRow } from "../util";
import { generateUniqueUUIDv4 } from "src/uuid";

export const 
  handleArrayAddAction = (state : iFormState, action : ArrayEventAdd) => {
    const 
      { data, listName } = action.payload,
      getNewFormState = (formState : Immutable.Map<string, any>) => {
        const listUpdater = (list: any) => {
          const 
            ID = generateUniqueUUIDv4(),
            newRow = createRow(ID, data, listName);
        
          return list.push(newRow);
        };

        return formState.update(listName, listUpdater);
      };

    return state.update("state", getNewFormState);
  },
  handleArrayRemoveAction = (state : iFormState, action : ArrayEventRemove) => {
    const 
      { ID, listName } = action.payload,
      getNewFormState = (formState : Immutable.Map<string, any>) =>  {
        const listUpdater = (data: Immutable.List<Immutable.Map<string, any>>) => {
          const index = data.findIndex((current: Immutable.Map<string, any>) => (
            current.get("ID") === ID
          ));

          return data.delete(index);
        };

        return formState.update(listName, listUpdater);
      };

    return state.update("state", getNewFormState);
  };