import Immutable from "immutable";
import { describe, expect, it } from "vitest";
import { ID_FieldName } from "../types";
import { getNodesFromString, getRealPath } from "../util";
import { FieldUnRegisterUpdaters } from "./field-unRegister";

describe("FieldUnRegisterUpdaters", () => {
  describe("checkDirty", () => {
    it("given an empty list, it returns an empty list", () => {
      const 
        initialState = Immutable.fromJS({
          dirtyFields: Immutable.Set(),
        }),
        idFieldName : ID_FieldName =  "username" as ID_FieldName,
        newState = FieldUnRegisterUpdaters.checkDirty(idFieldName)(initialState);

      expect(newState).toEqual(initialState);
    });

    it("given a list with items which does not contain that, it returns the list", () => {
      const 
        initialState = Immutable.fromJS({
          dirtyFields: Immutable.Set(["password"]),
        }),
        idFieldName : ID_FieldName =  "username" as ID_FieldName,
        newState = FieldUnRegisterUpdaters.checkDirty(idFieldName)(initialState);

      expect(newState).toEqual(initialState);
    });

    it("given a list with items which contains that, it returns the list without it", () => {
      const 
        initialState = Immutable.fromJS({
          dirtyFields: Immutable.Set(["username"]),
        }),
        idFieldName : ID_FieldName =  "username" as ID_FieldName,
        newState = FieldUnRegisterUpdaters.checkDirty(idFieldName)(initialState);

      expect(newState.get("dirtyFields")).toEqual(Immutable.Set());
    });
  
  });

  describe("handleNodeHasOneReference", () => {
    describe("given a single node with one reference", () => {
      it("remove it from management, and remove the fieldName from dirtyFields", () => {
        const 
          idFieldName : ID_FieldName =  "username" as ID_FieldName,
          initialState = Immutable.Map({
            "dirtyFields" : Immutable.Set(["username", "something_else"]),
            [idFieldName] : Immutable.Map({
              "REFERENCES": 1,
            }),
          }),
          nodes = getRealPath(getNodesFromString(idFieldName)),
          newState = initialState.withMutations((management : Immutable.Map<string, any>) => (
            FieldUnRegisterUpdaters.handleNodeHasOneReference({
              idFieldName,
              nodes,
              management,
            })
          )),
          expectedState = Immutable.Map({
            "dirtyFields": Immutable.Set(["something_else"]),
          });

        expect(newState).toEqual(expectedState);
      });
    });
    describe("given list", () => {
      describe("if the current has at least 2 fields", () => {
        it("remove it from management, and remove the fieldName from dirtyFields", () => {
          const 
            idFieldName : ID_FieldName =  "items.ID.name" as ID_FieldName,
            initialState = Immutable.Map({
              "dirtyFields" : Immutable.Set(["items.ID.name", "items.ID.surname"]),
              "items"       : Immutable.Map({
                "ID": Immutable.Map({
                  "VALUES": Immutable.Map({
                    "surname": Immutable.Map({
                      "REFERENCES": 1,
                    }),
                    "name": Immutable.Map({
                      "REFERENCES": 1,
                    }),
                  }),
                }),
              }),
            }),
            nodes = getRealPath(getNodesFromString(idFieldName)),
            newState = initialState.withMutations((management : Immutable.Map<string, any>) => (
              FieldUnRegisterUpdaters.handleNodeHasOneReference({
                idFieldName,
                nodes,
                management,
              })
            )),
            expectedState = Immutable.Map({
              "dirtyFields" : Immutable.Set(["items.ID.surname"]),
              "items"       : Immutable.Map({
                "ID": Immutable.Map({
                  "VALUES": Immutable.Map({
                    "surname": Immutable.Map({
                      "REFERENCES": 1,
                    }),
                  }),
                }),
              }),
            });

          expect(newState).toEqual(expectedState);
        });
      });
      describe("if the current row has only this field", () => {
        it("removes the entire row", () => {
          const 
            idFieldName : ID_FieldName =  "items.ID.name" as ID_FieldName,
            initialState = Immutable.Map({
              "dirtyFields" : Immutable.Set(["items.ID.name"]),
              "items"       : Immutable.Map({
                "ID": Immutable.Map({
                  "VALUES": Immutable.Map({
                    "name": Immutable.Map({
                      "REFERENCES": 1,
                    }),
                  }),
                }),
              }),
            }),
            nodes = getRealPath(getNodesFromString(idFieldName)),
            newState = initialState.withMutations((management : Immutable.Map<string, any>) => (
              FieldUnRegisterUpdaters.handleNodeHasOneReference({
                idFieldName,
                nodes,
                management,
              })
            )),
            expectedState = Immutable.Map({
              "dirtyFields" : Immutable.Set([]),
              "items"       : Immutable.Map({
              }),
            });

          expect(newState).toEqual(expectedState);
        });
      });
    });
  });
});
