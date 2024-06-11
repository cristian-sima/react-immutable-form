import Immutable from "immutable";
import { describe, expect, it } from "vitest";
import { ID_FieldName } from "../types";
import { FormSetFieldValidator } from "../types-actions";
import { fieldSetValidator } from "./field-setValidator";

describe("fieldSetValidator", () => {
  it("should update the validator for a single node path", () => {
    const 
      state = Immutable.fromJS({
        state      : Immutable.Map(),
        validators : Immutable.Map(),
      }),
      idFieldName : ID_FieldName =  "username" as ID_FieldName,
      action: FormSetFieldValidator = {
        type    : "form-set-field-validator",
        payload : {
          idFieldName ,
          value: () => undefined,
        },
      },
      newState = fieldSetValidator(state, action),
      validator = newState.getIn(["validators", "username"]);

    expect(typeof validator).toBe("function");
  });

  it("should add the validator for a multi-node path", () => {
    const 
      state = Immutable.fromJS({
        state      : Immutable.Map(),
        validators : Immutable.Map({
          surname: () => {}, 
        }),
      }),
      idFieldName : ID_FieldName =  "items.ID.name" as ID_FieldName,
      action: FormSetFieldValidator = {
        type    : "form-set-field-validator",
        payload : {
          idFieldName ,
          value: () => undefined,
        },
      },
      newState = fieldSetValidator(state, action),
      validator = newState.getIn(["validators", "items", "name"]);

    expect(typeof validator).toBe("function");
  });

  
  it("should update the existing validator for a multi-node path", () => {
    const 
      state = Immutable.fromJS({
        state      : Immutable.Map(),
        validators : Immutable.Map({
          name: () => "first", 
        }),
      }),
      idFieldName : ID_FieldName =  "items.ID.name" as ID_FieldName,
      action: FormSetFieldValidator = {
        type    : "form-set-field-validator",
        payload : {
          idFieldName ,
          value: () => "second",
        },
      },
      newState = fieldSetValidator(state, action),
      validator = newState.getIn(["validators", "items", "name"]) as () => string;

    expect(validator()).toBe("second");
  });
});
