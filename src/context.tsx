import { createContext } from "react";
import { ImmutableFormHandlers } from "./types";

const FormContext = createContext<ImmutableFormHandlers>({} as any);

export default FormContext;