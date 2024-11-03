/* eslint-disable no-alert */
/* eslint-disable no-magic-numbers */
/* eslint-disable no-console */
import Immutable from "immutable";
import React, { useCallback } from "react";
import { ImmutableField, ImmutableForm } from "../..";
import { ImmutableFormDecorators, onSubmitImmutableFormErrorFunc, onSubmitImmutableFormFunc } from "../../types";
import ImmutableFormJSON from "../_helpers/ImmutableFormJSON";


const 
  DerivedStateForm = () => {
    const
      initialValues = Immutable.fromJS({
        Input: "",
      }),
      derived = Immutable.fromJS({
        sumOfAllTotals: 0,
      }),

      // the validators 
      atLeastChars = (nrOfChars :number) => (
        (value: any) => {
          if (typeof value !== "string" || String(value).length < nrOfChars ) {
            return `At least ${nrOfChars} chars`;
          }
    
          return undefined;
        }
      ),
      initialValidators = Immutable.Map({
        "Input": atLeastChars(3),
      }),
      // define onSubmit
      onSubmit : onSubmitImmutableFormFunc  = (values) => 
      {
        alert(`values.toJS(): ${  JSON.stringify(values.toJS())}`);

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            try {
              // done 
              resolve();
            } catch (error) {
              // errors
              reject(error);
            }
          }, 2000);
        });
      },

      // in case the form fails to validate
      onSubmitError : onSubmitImmutableFormErrorFunc = useCallback((errors) => {
        alert(`errors${  JSON.stringify(errors)}`);
      }, []),
      
      // define your decorators
      decorators : ImmutableFormDecorators = Immutable.Map({
        "Input": ({ formData, value }) => {

          const 
            increaseTotal = (newAge : any = 0) => newAge + (isNaN(Number(value)) ? 0 : Number(value)) as any;
            
          formData.updateIn(["derived", "sumOfAllTotals"], increaseTotal);
        },
      });
      

    return (
      <div className="m-3 p-3 alert alert-secondary">
        <ImmutableForm 
          decorators={decorators}
          derived={derived}
          initialValidators={initialValidators}
          initialValues={initialValues}
          onSubmit={onSubmit}
          onSubmitError={onSubmitError}>
          {(form) => {
            const 
              inputRef = React.useRef<HTMLInputElement>(null),
              focusInput = () => {
                if (inputRef && inputRef.current) {
                  inputRef.current.focus();
                }
              },
              { handleSubmit, management } = form,
              isSubmitting = management.get("isSubmitting"),
              resetToZero = () => {
                const 
                  oldState = form.getFormData().get("derived"),
                  newState = oldState.set("sumOfAllTotals", 0);

                form.handleChange("Input", "");
                form.formSetDerivedState(newState);
                focusInput();
              };

            return (
              <form onSubmit={handleSubmit}>
                <ImmutableField
                  inputProps={{ autoFocus: true, ref: inputRef }}
                  name="Input"
                />
                <div className="alert alert-secondary mt-2">
                  {"For each change of the Input, it will calculate the sum of all previous values typed"}
                </div>
                {
                  "The sum: "
                }
                <span className="badge text-bg-primary">
                  {  form.getFormData().getIn(["derived", "sumOfAllTotals"])}
                </span>
                <hr />
                <button
                  className="btn btn-primary mx-1"
                  disabled={isSubmitting}
                  type="submit">
                  {"Submit form"}
                </button>
                <button
                  className="btn btn-primary mx-1"
                  disabled={isSubmitting}
                  onClick={resetToZero}
                  type="button">
                  {"Reset Input to empty and sum to 0"}
                </button>
                <ImmutableFormJSON formData={form.getFormData()} />
              </form>
            );
          }}
        </ImmutableForm>
      </div>
    );
  };

export default DerivedStateForm;