import React from "react";
import FormContext from "./context";
import { ImmutableFormProps } from "./types";
import useImmutableForm from "./useImmutableForm";

const 
  /**
 * ImmutableForm is a form management library that utilizes Immutable.js structures for handling form state.
 * 
 * The use of Immutable.js provides several key benefits:
 * 
 * 1. **Performance Improvement**: By using immutable data structures, the form can leverage structural sharing,
 *    which reduces the need to create new copies of objects when changes occur. This leads to improved performance,
 *    especially when dealing with large or deeply nested data.
 * 
 * 2. **Reduced Updates**: Immutable structures help in reducing unnecessary updates. When the state changes,
 *    only the parts of the data that have actually changed are updated, minimizing the number of updates and re-renders.
 * 
 * 3. **Efficient Data Management with Redux**: When integrated with Redux, using immutable data ensures that the state 
 *    changes are predictable and traceable. Immutable.js structures provide a straightforward way to implement Redux's 
 *    state management principles, making it easier to manage and debug application state.
 * 
 * This form library is designed to take full advantage of these benefits, ensuring that form management is efficient,
 * predictable, and easy to maintain.
 */
  ImmutableForm = <T extends object>({ children, ...rest } : ImmutableFormProps<T>) => {
    const 
      formHandlers = useImmutableForm<T>(rest, rest.onSubmit);
    
    if (typeof children === "function") {
      return (
        <FormContext.Provider value={formHandlers}>
          {children(formHandlers)}
        </FormContext.Provider>
      );
    }

    return React.cloneElement(children as any, formHandlers);
  }; 

export default ImmutableForm;