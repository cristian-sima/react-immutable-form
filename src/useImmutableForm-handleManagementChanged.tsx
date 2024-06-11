import { FormOptions, ImmutableFormHandlers, onSubmitFunc } from "./types";
import { ImmutableFormActions } from "./types-actions";
import { FORM_ERROR } from "./util";
import { getWords } from "./words";

/**
 * Additional options for handling form management changes.
 * @internal
 */
type Options = {
  /**
   * A dispatch function for form actions.
   */
  dispatchFormAction: React.Dispatch<ImmutableFormActions>;
  /**
   * A function to be executed on form submission.
   */
  onSubmit: onSubmitFunc;
};

export const 
  /**
   * Handles changes in form management. It is called by React.useEffect
   * @param api The ImmutableFormHandlers API.
   * @param options FormOptions for configuring form behavior.
   * @param ownOptions Additional options for handling form management changes.
   * @returns A function to handle management changes.
   * @internal
   */
  handleManagementChanged = (api : ImmutableFormHandlers, options : FormOptions, ownOptions : Options) => () => {
    const
      { onSubmit, dispatchFormAction } = ownOptions, 
      { management } = api,
      performSubmit = (values : Immutable.Map<string, any>, errors : Immutable.Map<string, any>) => {
        const               
          hasErrors = errors.size !== 0,
          setError = (err : string) =>  {
            api.formSetIsSubmitting(false, err);
          },
          handleNoError = () => {
            const 
              performForm = () => {
                setTimeout(async () => {
                  try {
                    api.formSetIsSubmitting(true);
  
                    const requestResult = await onSubmit(values, dispatchFormAction);
        
                    if (requestResult === FORM_ERROR) {
                      setError("Form submission failed");
                    } else {
                      api.formSetIsSubmitting(false);
                    }
                  } catch (error) {
                    setError(getWords().SOMETHING_WENT_WRONG);
                  }
                });
              };
    
            performForm();
          };
    
        if (hasErrors) {
          if (typeof options.onSubmitError === "function") {
            options.onSubmitError(errors, dispatchFormAction);
          }
        } else {
          try {
            handleNoError();
          } catch (err) {
            setError(getWords().SOMETHING_WENT_WRONG);
          } 
        }
      };
  
    if (management.get("readyToSubmit")) {
      const 
        values = management.get("values"),
        errors = management.get("errors");
  
      api.formSubmitHandled();
      performSubmit(values, errors);
    }
  };