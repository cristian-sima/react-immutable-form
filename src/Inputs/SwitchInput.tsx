import Immutable from "immutable";
import React from "react";
import { FieldRendererProps } from "../types";

export type SwitchInputProps = FieldRendererProps<HTMLInputElement> & {
  readonly customClass?: any;
};

const 
  SwitchInputInner = (props: SwitchInputProps) => {
    const
      { customClass, name, data = Immutable.Map(), handleBlur, handleChange, handleFocus } = props,
      renderCount = React.useRef(0),
      value = data.get("value"),
      checked = value === true,
      meta = data.get("meta") || Immutable.Map(),
      theError = meta.get("theError"),

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
        const theValue = event.target.checked === true;
        
        if (typeof props.customOnChange === "function") {
          props.customOnChange(event, handleChange, name);
        } else {
          handleChange(name, theValue);
        }
      },
      hasError = typeof theError !== "undefined",
      theClass = `${hasError ? "is-invalid" : ""} ${customClass ? customClass : ""} form-check-input`,
      wrapperClassName = `form-check ${props.componentProps?.get("checkbox") ? "": "form-switch"}`;

    React.useEffect(() => {
      renderCount.current += 1;
    });

    return (
      <>
        <span className="badge text-bg-primary">{renderCount.current}</span>
        <div className={wrapperClassName}>
          <input
            checked={checked}
            className={theClass}
            disabled={props.disabled}
            id={name}
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            type="checkbox"
            value={value}
            {...props.elementProps}
          />
          <label className="form-check-label" htmlFor={name}>
            {props.componentProps?.get("label")}
          </label>
          {
            !props.hideError && hasError ? (
              <span className="text-danger">{theError}</span>
            ) : null 
          }
        </div>
      </>
    );
  };

export const RawSwitchInput = React.memo(SwitchInputInner);
