import ImmutableFormError from "./error";
import { ImmutableFormHandlers, ImmutableFormOptions, onSubmitImmutableFormFunc } from "./types";
import { ImmutableFormActions } from "./types-actions";
import { getWords } from "./words";

/**
 * Additional options for handling form management changes.
 * @internal
 */
type handleManagementChangedOptions = {
  dispatchFormAction: React.Dispatch<ImmutableFormActions>;
  onSubmit: onSubmitImmutableFormFunc;
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
  handleManagementChanged = <T>(api : ImmutableFormHandlers<T>, options : ImmutableFormOptions, ownOptions : handleManagementChangedOptions) => () => {
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
  
                    await onSubmit(values, dispatchFormAction);
        
                    api.formSetIsSubmitting(false);
                  } catch (error) {
                    if (error instanceof ImmutableFormError) {
                      setError(error.message);
                    } else {
                      setError(getWords().SOMETHING_WENT_WRONG);
                    }
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