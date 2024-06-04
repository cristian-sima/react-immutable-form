import Immutable from "immutable";
import React from "react";
import { FieldRendererProps } from "../types";

export type SimpleInputProps = FieldRendererProps<HTMLInputElement> & {
  readonly customClass?: any;
  readonly theType?: "input" | "password";
};

const 
  SimpleInputInner = (props: SimpleInputProps) => {
    const
      { customClass, name, data = Immutable.Map(), handleBlur, handleChange, handleFocus } = props,
      renderCount = React.useRef(0),
      value = data.get("value") || "",
      meta = data.get("meta") || Immutable.Map(),
      theError = meta.get("theError") as string | undefined,
      isTouched = meta.get("isTouched") as boolean,
      onFocus = (event : React.FocusEvent<HTMLInputElement, Element>) => {
        if (typeof props.customOnFocus === "function") {
          props.customOnFocus(event, handleFocus, name);
        } else {
          handleFocus(name);
        }
      }, 
      onBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        if (typeof props.customOnBlur === "function") {
          props.customOnBlur(event, handleBlur, name);
        } else {
          handleBlur(name);
        }
      },
      onChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
        if (typeof props.customOnChange === "function") {
          props.customOnChange(event, handleChange, name);
        } else {
          handleChange(name, event.target.value);
        }
      },
      hasError = typeof theError !== "undefined",
      showError = isTouched && hasError,
      theClass = `${showError ? "is-invalid" : ""} ${customClass ? customClass : ""} form-control`;

    React.useEffect(() => {
      renderCount.current += 1;
    });

    return (
      <>
        <span className="badge text-bg-primary">{renderCount.current}</span>
        <input
          className={theClass}
          disabled={props.disabled}
          id={name}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          type={props.theType} 
          value={value}
          {...props.elementProps}
        />
        {
          !props.hideError && showError ? (
            <span className="text-danger">{theError}</span>
          ) : null 
        }
      </>
    );
  };

export const RawSimpleInput = React.memo(SimpleInputInner);