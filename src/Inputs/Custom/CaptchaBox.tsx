import Immutable from "immutable";
import React from "react";
import { FieldRendererProps } from "../../types";

export type CaptchaBoxProps = FieldRendererProps<HTMLInputElement> & {
  readonly left?: string;
  readonly right?: string;
  readonly words: { CaptchaVerify: string; CaptchaTypeNumbers: string };
  readonly id: string;
};

const CaptchaBoxInner = (props: CaptchaBoxProps) => {
    const {
        left, right, words, id,
        name, data = Immutable.Map(),
        handleBlur,
        handleChange,
        handleFocus,
        customOnFocus,
        customOnBlur,
        customOnChange,
        disabled,
        hideError,
        elementProps,
      } = props,

      value = data.get("value") || "",
      meta = data.get("meta") || Immutable.Map(),
      theError = meta.get("theError") as string | undefined,
      isTouched = meta.get("isTouched") as boolean,
      hasError = typeof theError !== "undefined",
      showError = isTouched && hasError,

      onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        if (typeof customOnFocus === "function") {
          customOnFocus(event, handleFocus, name);
        } else {
          handleFocus(name);
        }
      },

      onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (typeof customOnBlur === "function") {
          customOnBlur(event, handleBlur, name);
        } else {
          handleBlur(name);
        }
      },

      onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof customOnChange === "function") {
          customOnChange(event, handleChange, name);
        } else {
          handleChange(name, event.target.value);
        }
      },

      theClass = `${showError ? "is-invalid" : ""} form-control`;

    return (
      <div className="form-group row d-flex">
        <label
          className={`${left ? `${left} align-self-center` : "col-md-4 text-md-end"} form-control-label align-self-center`}
          htmlFor={name}>
          {`${words.CaptchaVerify} `}
          <i className="fa fa-info-circle" />
        </label>
        <div className={right ? `${right} align-self-center` : "col-md-8 align-self-center"}>
          <div className="custom-class">
            <span className="custom-control-description text-muted">
              {words.CaptchaTypeNumbers}
            </span>
            <div className="text-center my-1">
              <img alt="CaptchaBox" src={`/captcha/${id}.png`} />
            </div>
          </div>
          <input
            className={theClass}
            disabled={disabled}
            id={name}
            name={name}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            type="text"
            value={value}
            {...elementProps}
          />
          {!hideError && showError ? (
            <span className="text-danger">{theError}</span>
          ) : null}
        </div>
      </div>
    );
  },

  CaptchaBox = React.memo(CaptchaBoxInner);

export default CaptchaBox;
