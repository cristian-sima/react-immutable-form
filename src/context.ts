import { createContext } from "react";
import { ImmutableFormHandlers } from "./types";

/**
 * A context for providing ImmutableFormHandlers.
 * This context is used to provide handlers for managing forms with immutable data structures.
 * @template T The type of the provided ImmutableFormHandlers.
 */
const FormContext = createContext<ImmutableFormHandlers<any>>({} as any);

export default FormContext;