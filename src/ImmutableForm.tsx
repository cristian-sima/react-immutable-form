import React, { ReactElement } from "react";
import FormContext from "./context";
import { ImmutableFormHandlers } from "./types";

interface FormInterface { readonly form :  ImmutableFormHandlers}

interface ImmutableFormProps {
  readonly children: ReactElement<FormInterface>;
  readonly handlers: ImmutableFormHandlers;
}

const 
  ImmutableForm :  React.FC<ImmutableFormProps> = ({ handlers, children }) => (
    <FormContext.Provider value={handlers}>
      <form onSubmit={handlers.handleSubmit}>
        { React.cloneElement(children as React.ReactElement<FormInterface>, { form: handlers })}
      </form>
    </FormContext.Provider>
  );

export default ImmutableForm;