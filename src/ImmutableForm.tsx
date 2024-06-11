import React from "react";
import FormContext from "./context";
import { FormInterface, ImmutableFormProps } from "./types";

const 
  /**
   * ImmutableForm component.
   *
   * A React functional component that provides a form context and handles form submission.
   *
   * @param props - The props for the ImmutableForm component.
   * @param props.handlers - An object containing form handler functions.
   * @param props.children - The child elements to be rendered within the form.
   * 
   * @returns The ImmutableForm component.
   */
  ImmutableForm :  React.FC<ImmutableFormProps> = ({ handlers, children }) => (
    <FormContext.Provider value={handlers}>
      <form onSubmit={handlers.handleSubmit}>
        { React.cloneElement(children as React.ReactElement<FormInterface>, { form: handlers })}
      </form>
    </FormContext.Provider>
  );

export default ImmutableForm;