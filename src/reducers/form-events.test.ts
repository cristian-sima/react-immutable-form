import Immutable from "immutable";
import { describe, expect, it } from "vitest";
import { FormSetDerivedState, FormSetIsSubmitting } from "../types-actions";
import { handleFormSubmitHandled, setFormDerivedState, setFormIsSubmitting } from "./form-events";

describe("handleFormSubmitHandled", () => {
  it("should set formError, readyToSubmit, values, and errors in management to undefined and false", () => {
    const formData = Immutable.fromJS({
        management: {
          formError     : "Some error",
          readyToSubmit : true,
          values        : { some: "value" },
          errors        : { some: "error" },
        },
      }),

      result = handleFormSubmitHandled(formData);

    expect(result.getIn(["management", "formError"])).toBeUndefined();
    expect(result.getIn(["management", "readyToSubmit"])).toBe(false);
    expect(result.getIn(["management", "values"])).toBeUndefined();
    expect(result.getIn(["management", "errors"])).toBeUndefined();
  });

  it("should work with an empty initial state", () => {
    const formData = Immutable.Map<string, any>({}),

      result = handleFormSubmitHandled(formData);

    expect(result.getIn(["management", "formError"])).toBeUndefined();
    expect(result.getIn(["management", "readyToSubmit"])).toBe(false);
    expect(result.getIn(["management", "values"])).toBeUndefined();
    expect(result.getIn(["management", "errors"])).toBeUndefined();
  });
});

describe("setFormIsSubmitting", () => {
  it("should set isSubmitting and formError in management based on action payload", () => {
    const formData = Immutable.fromJS({
        management: {
          isSubmitting : false,
          formError    : undefined,
        },
      }),

      action: FormSetIsSubmitting = {
        type    : "form-set-isSubmitting",
        payload : {
          isSubmitting : true,
          error        : "Submission error",
        },
      },

      result = setFormIsSubmitting(formData, action);

    expect(result.getIn(["management", "isSubmitting"])).toBe(true);
    expect(result.getIn(["management", "formError"])).toBe("Submission error");
  });

  it("should set formError to undefined if not provided in action payload", () => {
    const formData = Immutable.fromJS({
        management: {
          isSubmitting : false,
          formError    : "Previous error",
        },
      }),

      action: FormSetIsSubmitting = {
        type    : "form-set-isSubmitting",
        payload : {
          isSubmitting: true,
        },
      },

      result = setFormIsSubmitting(formData, action);

    expect(result.getIn(["management", "isSubmitting"])).toBe(true);
    expect(result.getIn(["management", "formError"])).toBeUndefined();
  });

  it("should work with an empty initial state", () => {
    const formData = Immutable.Map<string, any>({}),

      action: FormSetIsSubmitting = {
        type    : "form-set-isSubmitting",
        payload : {
          isSubmitting : true,
          error        : "New error",
        },
      },

      result = setFormIsSubmitting(formData, action);

    expect(result.getIn(["management", "isSubmitting"])).toBe(true);
    expect(result.getIn(["management", "formError"])).toBe("New error");
  });

  describe("setFormDerivedState", () => {
    it("should change the derived", () => {
      const formData = Immutable.fromJS({
          management: {
            isSubmitting : false,
            formError    : undefined,
          },
          derived: Immutable.Map({
            "user": "name",
          }),
        }),

        action: FormSetDerivedState = {
          type    : "form-set-derived-state",
          payload : Immutable.Map({
            "user": "red",
          }),
        },

        result = setFormDerivedState(formData, action),
        expectedState = Immutable.fromJS({
          management: {
            isSubmitting : false,
            formError    : undefined,
          },
          derived: Immutable.Map({
            "user": "red",
          }),
        });

      expect(result).toEqual(expectedState);
    });
  });
});