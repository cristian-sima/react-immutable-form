

import Immutable from "immutable";
import React from "react";
import { formatZeroValue } from "x25/utility";
import { clearFloatOnBlur, floatToEnglishComma, getFloatValueToStore, isFloat } from "../../../../../common";
import { HandleBlurFunc, HandleChangeFunc } from "../types";
import { SimpleInputProps } from "./SimpleInput";

type handleNumericBlurFunc = () => any;
type handleNumericChangeFunc = () => any;

export type InputTemplatePropTypes = SimpleInputProps & {
  readonly customOnBlur?: (event : React.FocusEvent<HTMLInputElement, Element>, handleNumericBlur : handleNumericBlurFunc, handleBlur: HandleBlurFunc, name: string ) => any;
  readonly customOnChange?: (event : React.ChangeEvent<HTMLInputElement>, handleNumericChange : handleNumericChangeFunc, handleChange: HandleChangeFunc, name: string ) => any;
}

export type formatValueFunc =  (raw: any, optional?: boolean) => string;

const NumericInputInner = (props: InputTemplatePropTypes) => {
  const
    renderCount = React.useRef(0),
    { componentProps = Immutable.Map(), customClass, name, data = Immutable.Map() } = props,

    meta = data.get("meta") || Immutable.Map(),
    inputValue = data.get("value") || "",

    theError = meta.get("theError") as string | undefined,
    isTouched = meta.get("isTouched") as boolean,

    currency = componentProps && componentProps.get("currency") as string | undefined,
    precision = componentProps && componentProps.get("precision") || 2,
    optional = componentProps && componentProps.get("optional") as boolean | undefined,
    formatValue = componentProps && componentProps.get("formatValue") || formatZeroValue as formatValueFunc,
    
    hasError = typeof theError !== "undefined",
    showError = isTouched && hasError,
    theClass = `${showError ? "is-invalid" : ""} ${customClass ? customClass : ""} form-control`,
    
    [value, setValue] = React.useState(inputValue),

    noCurrency = (typeof currency === "undefined" || Boolean(currency) === false),
    valueToShow = formatValue(value, optional),
    
    updateNumericValue = (targetValue : any) => {        
      setValue(targetValue);

      let valueToStore = targetValue;

      if (isFloat(floatToEnglishComma(targetValue))) {
        valueToStore = getFloatValueToStore(targetValue);
      }

      props.handleChange(name, valueToStore);
    },
    onBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
      const numericHandleOnBlur = () => {
        const
          newValue = clearFloatOnBlur(value, precision),
          hasChanged = value !== newValue;

        if (hasChanged) {
          updateNumericValue(newValue);
        }

        props.handleBlur(name);
      };

      if (typeof props.customOnBlur === "function") {
        props.customOnBlur(event, numericHandleOnBlur, props.handleBlur, name);
      } else {
        numericHandleOnBlur();
      }
    },
    onChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
      if (typeof props.customOnChange === "function") {
        const wrapper = () => {
          updateNumericValue(event.target.value);
        };

        props.customOnChange(event, wrapper, props.handleChange, name);
      } else {
        updateNumericValue(event.target.value);
      }
    },
    onFocus = (event : React.FocusEvent<HTMLInputElement, Element>) => {
      if (typeof props.customOnFocus === "function") {
        props.customOnFocus(event, props.handleFocus, name);
      } else {
        props.handleFocus(name);
      }
    };
    
  React.useEffect(() => {
    const
      hasFloat = isFloat(inputValue),
      wasValidatedWithErrors = !hasFloat && (typeof theError === "string");

    if (hasFloat || wasValidatedWithErrors) {
      updateNumericValue(inputValue);
    }
  }, [data, theError]);

  React.useEffect(() => {
    renderCount.current += 1;
  });

  if (noCurrency) {
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
          value={valueToShow}
          {...props.elementProps}
        />
        {
          !props.hideError && showError ? (
            <span className="text-danger">{theError}</span>
          )  : null 
        }
      </>
    );
  }

  return (
    <>
      <div className="input-group">
        <span className="badge text-bg-primary input-group-text">{renderCount.current}</span>
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
        <span className="input-group-text">
          {currency}
        </span>
      </div>
      {
        !props.hideError && showError ? (
          <span className="text-danger">{theError}</span>
        )  : null 
      }
    </>
  );
};

export const RawNumericInput = React.memo(NumericInputInner);