import Immutable from "immutable";
import { describe, expect, it } from "vitest";
import { getDefaultField } from "../util";
import { handleOnFocus } from "./field-onFocus";
import { FieldEventOnFocusAction } from "src/types-actions";
import { ID_FieldName, INDEX_FieldName } from "src/types";

describe("handleOnFocus", () => {
  describe("if a field does not exists in the state", () => {
    it("should add a new field with isFocused set to true", () => {
      const 
        field = "newField" as ID_FieldName,
        initialState = Immutable.Map({
          state: Immutable.Map(),
        }),
        action : FieldEventOnFocusAction = {
          type    : "field-event-onFocus",
          payload : {
            field,
            name: "newField" as INDEX_FieldName,
          },
        },
        focusedNodes = Immutable.List(["meta", "isFocused"]),
        newState = handleOnFocus(initialState, action),
        newField = newState.getIn(["state", field]) as Immutable.Map<string, any>;

      expect(newField.toJS()).toEqual(
        getDefaultField(field, "").setIn(focusedNodes, false).toJS(),
      );
    });
  });

  describe("if a field exists in the state", () => {
    it("should set isFocused to true for that field", () => {
      const field = "testField" as ID_FieldName,
        initialState = Immutable.Map({
          state: Immutable.Map({
            testField: getDefaultField(field, "").setIn(["meta", "isFocused"], false),
          }), 
        }),
        action : FieldEventOnFocusAction = {
          type    : "field-event-onFocus",
          payload : {
            field,
            name: "newField" as INDEX_FieldName,
          },
        },
        newState = handleOnFocus(initialState, action);

      expect(newState.getIn(["state", "testField", "meta", "isFocused"])).toBe(true);
    });

    it("should not modify other fields in the state", () => {
      const field = "testField" as ID_FieldName,
        otherField = "otherField",
        initialState = Immutable.Map({
          state: Immutable.Map({
            testField  : getDefaultField(field, "").setIn(["meta", "isFocused"], false),
            otherField : getDefaultField(otherField, "").setIn(["meta", "isFocused"], false),
          }),
        }),
        action : FieldEventOnFocusAction = {
          type    : "field-event-onFocus",
          payload : {
            field,
            name: "newField" as INDEX_FieldName,
          },
        },
        newState = handleOnFocus(initialState, action);

      expect(newState.getIn(["state", "testField", "meta", "isFocused"])).toBe(true);
      expect(newState.getIn(["state", "otherField", "meta", "isFocused"])).toBe(false);
    });
  });
});
