/* eslint-disable no-magic-numbers */
import { fromJS } from "immutable";
import { describe, expect, it } from "vitest";
import { ImmutableFormState } from "./array";
import { handleOnBlur } from "./field-onBlur";
import { FieldEventOnBlurAction } from "src/types-actions";

// Mock validator function
const mockValidator = (value: any) => typeof value === "string" && value !== "" ? undefined : "Required";

describe("handleOnBlur", () => {
  it("should update state with isTouched and isFocused for existing field", () => {
    const initialState: ImmutableFormState = fromJS({
        state: {
          field1: {
            value : "test",
            meta  : {
              isTouched : false,
              isFocused : true,
              theError  : undefined,
            },
          },
        },
        validators: {
          field1: mockValidator,
        },
      }),

      action: FieldEventOnBlurAction = {
        type    : "field-event-onBlur",
        payload : {
          field: "field1",
        },
      },

      newState = handleOnBlur(initialState, action),
      fieldMeta = newState.getIn(["state", "field1", "meta"]) as Immutable.Map<string, any>;

    expect(fieldMeta.get("isTouched")).toBe(true);
    expect(fieldMeta.get("isFocused")).toBe(false);
    expect(fieldMeta.get("theError")).toBeUndefined();
  });

  it("should validate field and update error message", () => {
    const initialState: ImmutableFormState = fromJS({
        state: {
          field1: {
            value : "",
            meta  : {
              isTouched : false,
              isFocused : true,
              theError  : undefined,
            },
          },
        },
        validators: {
          field1: mockValidator,
        },
      }),

      action: FieldEventOnBlurAction = {
        type    : "field-event-onBlur",
        payload : {
          field: "field1",
        },
      },

      newState = handleOnBlur(initialState, action),
      fieldMeta = newState.getIn(["state", "field1", "meta"]) as Immutable.Map<string, any>;

    expect(fieldMeta.get("isTouched")).toBe(true);
    expect(fieldMeta.get("isFocused")).toBe(false);
    expect(fieldMeta.get("theError")).toBe("Required");
  });

  it("should create and update state for non-existing field", () => {
    const initialState: ImmutableFormState = fromJS({
        state      : {},
        validators : {
          field1: mockValidator,
        },
      }),

      action: FieldEventOnBlurAction = {
        type    : "field-event-onBlur",
        payload : {
          field: "field1",
        },
      },

      newState = handleOnBlur(initialState, action),
      fieldState = newState.getIn(["state", "field1"]) as Immutable.Map<string, any>,
      fieldMeta = fieldState.get("meta");

    // console.log("newState.toJS()", newState.toJS());
    // console.log("fieldMeta.toJS()", fieldMeta.toJS());
    // console.log("fieldMeta.toJS()", fieldMeta.toJS());

    expect(fieldMeta.get("isTouched")).toBe(true);
    expect(fieldMeta.get("isFocused")).toBe(false);
    expect(fieldMeta.get("theError")).toBe("Required");
    expect(fieldState.get("value")).toBe("");
  });

  it("should handle validators as a function", () => {
    const validators = fromJS({
        field1: (value: any) => value.length < 5 ? "Too short" : undefined,
      }),

      initialState: ImmutableFormState = fromJS({
        state: {
          field1: {
            value : "abc",
            meta  : {
              isTouched : false,
              isFocused : true,
              theError  : undefined,
            },
          },
        },
        validators,
      }),

      action: FieldEventOnBlurAction = {
        type    : "field-event-onBlur",
        payload : {
          field: "field1",
        },
      },

      newState = handleOnBlur(initialState, action),
      fieldMeta = newState.getIn(["state", "field1", "meta"])  as Immutable.Map<string, any>;

    expect(fieldMeta.get("isTouched")).toBe(true);
    expect(fieldMeta.get("isFocused")).toBe(false);
    expect(fieldMeta.get("theError")).toBe("Too short");
  });

  it("should handle undefined validators correctly", () => {
    const initialState: ImmutableFormState = fromJS({
        state: {
          field1: {
            value : "test",
            meta  : {
              isTouched : false,
              isFocused : true,
              theError  : undefined,
            },
          },
        },
        validators: {},
      }),

      action: FieldEventOnBlurAction = {
        type    : "field-event-onBlur",
        payload : {
          field: "field1",
        },
      },

      newState = handleOnBlur(initialState, action),
      fieldMeta = newState.getIn(["state", "field1", "meta"]) as Immutable.Map<string, any>;

    expect(fieldMeta.get("isTouched")).toBe(true);
    expect(fieldMeta.get("isFocused")).toBe(false);
    expect(fieldMeta.get("theError")).toBeUndefined();
  });
});
