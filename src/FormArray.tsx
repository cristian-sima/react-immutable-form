import React, { useContext } from "react";
import FormContext from "./context";
import { FormArrayProps } from "./types";

const   
  FormArrayInner = ({ name, children }: FormArrayProps) => {
    if (typeof children === "undefined") {
      return null;
    }

    const
      { formState, handleArrayAdd, handleArrayRemove } = useContext(FormContext),
      data = formState.get(name) as Immutable.List<Immutable.Map<string, any>>,
      passedProps = {
        name,
        data,
        add    : handleArrayAdd,
        remove : handleArrayRemove,
      },
      memoizedFieldRenderer = React.useMemo(() => (
        React.createElement(children, passedProps)
      ), [name, data]);

    return memoizedFieldRenderer;
  },

  /**
   * FormArray component.
   * 
   * This component manages an array of form fields within a larger form. It provides functionality
   * to add and remove items from the array and passes these functions, along with the current data,
   * to its children.
   * It memories the props using React.memo
   * 
   * @param {Object} props - Component properties.
   * @param {string} props.name - The name of the array field in the form state.
   * @param {Function} props.children - A render function that receives the array management props.
   * 
   * @returns {JSX.Element | null} The FormArray component.
   */
  FormArray = React.memo(FormArrayInner);

export default FormArray;
