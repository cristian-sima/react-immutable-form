import Immutable from "immutable";
import React, { useRef } from "react";
import { FieldRendererProps } from "./types";
import { REFERENCES_PATH } from "./util";

const 
  FieldRendererInner = (props: FieldRendererProps<HTMLInputElement>) => {
    const
      { indexFileName, idFileName, data = Immutable.Map(), handleBlur, handleChange, handleFocus } = props,
      renderCount = useRef(0),
      value = data.get("value") || "",
      meta = data.get("meta") || Immutable.Map(),
      theError = meta.get("theError") as string | undefined,
      isTouched = meta.get("isTouched") as boolean,
      hasError = typeof theError !== "undefined",
      showError = isTouched && hasError,
      onFocus = (event : React.FocusEvent<HTMLInputElement, Element>) => {
        if (typeof props.customOnFocus === "function") {
          props.customOnFocus(event, handleFocus, idFileName, indexFileName);
        } else {
          handleFocus(idFileName, indexFileName);
        }
      }, 
      onBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        if (typeof props.customOnBlur === "function") {
          props.customOnBlur(event, handleBlur, idFileName, indexFileName);
        } else {
          handleBlur(idFileName, indexFileName);
        }
      },
      onChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
        if (typeof props.customOnChange === "function") {
          props.customOnChange(event, handleChange, idFileName);
        } else {
          handleChange(idFileName, event.target.value);
        }
      };

    React.useEffect(() => {
      renderCount.current += 1;
    });

    return (
      <div>
        <span className="badge text-bg-primary">{renderCount.current}</span>
        <span className="badge text-bg-danger">{meta.get(REFERENCES_PATH)}</span>
        <input
          disabled={props.disabled}
          name={indexFileName}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          value={value}
          {...props.elementProps}
        />
        {
          showError ? (
            <span className="text-danger">{theError}</span>
          ) : null
        }
      </div>
    );
  },
  
  /**
   * FieldRenderer component.
   * 
   * This component renders an individual form field, managing its value and metadata such as error messages.
   * It provides event handlers for focus, blur, and change events, and supports custom event handlers if provided.
   * It also tracks the number of times it has been rendered.
   * 
   * @param {Object} props - Component properties.
   * @param {string} props.name - The name of the field.
   * @param {Immutable.Map} [props.data=Immutable.Map()] - The field data, including its value and metadata.
   * @param {Function} props.handleBlur - The function to call on blur events.
   * @param {Function} props.handleChange - The function to call on change events.
   * @param {Function} props.handleFocus - The function to call on focus events.
   * @param {boolean} [props.disabled] - Indicates whether the input should be disabled.
   * @param {Object} [props.elementProps] - Additional props to pass to the input element.
   * @param {Function} [props.customOnBlur] - Custom blur event handler.
   * @param {Function} [props.customOnChange] - Custom change event handler.
   * @param {Function} [props.customOnFocus] - Custom focus event handler.
   * 
   * @returns {JSX.Element} The FieldRenderer component.
   */
  FieldRenderer = React.memo(FieldRendererInner);

export default FieldRenderer;