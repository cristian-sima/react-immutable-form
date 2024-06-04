import Immutable from "immutable";
import React from "react";
import { FieldRendererProps } from "../types";
import { getWords } from "../words";

export type SimpleSelectProps = FieldRendererProps<HTMLSelectElement> & {
  readonly customClass?: any;
};

type ImmutableListOfOptions = {
  readonly list: Immutable.List<Immutable.Map<string, any>>;
  readonly valueKey:string;
  readonly nameKey: string;
}

const 
  ImmutableListOfOptions = ({ list, valueKey, nameKey } : ImmutableListOfOptions) => (
    <>
      {
        list.map((current: any) => {
          const 
            optionValue = current.get(valueKey),
            optionName = current.get(nameKey) as string ;
          
          return (
            <option 
              key={optionValue}
              value={optionValue}>
              {optionName}
            </option>
          );
        })
      }
    </>
  ),    
  SimpleSelectInner = (props: SimpleSelectProps) => {
    const {
        customClass,
        name,
        data = Immutable.Map(),
        handleBlur,
        handleChange,
        handleFocus,
      } = props,

      componentProps = props.componentProps || Immutable.Map(),
      
      value = props.data.get("value"),
      meta = data.get("meta") || Immutable.Map(),
      theError = meta.get("theError") as string | undefined,
      isTouched = meta.get("isTouched") as boolean,

      onFocus = (event: React.FocusEvent<HTMLSelectElement, Element>) => {
        if (typeof props.customOnFocus === "function") {
          props.customOnFocus(event, handleFocus, name);
        } else {
          handleFocus(name);
        }
      },

      onBlur = (event: React.FocusEvent<HTMLSelectElement, Element>) => {
        if (typeof props.customOnBlur === "function") {
          props.customOnBlur(event, handleBlur, name);
        } else {
          handleBlur(name);
        }
      },

      onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const theValue = event.target.value;

        if (typeof props.customOnChange === "function") {
          props.customOnChange(event, handleChange, name);
        } else {
          handleChange(name, theValue);
        }
      },

      hasError = typeof theError !== "undefined",
      showError = isTouched && hasError,
      theClass = `${showError ? "is-invalid" : ""} ${customClass ? customClass : ""} form-select`,

      {
        valueKey = "value",
        nameKey = "name",
        isImmutable = false,
        showEmptyOption = false,
      } = React.useMemo(() => componentProps?.toJS() || {}, [componentProps]),
      list = componentProps.get("list") || Immutable.List();

    return (
      <>
        <select
          className={theClass}
          disabled={props.disabled}
          id={name}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          value={value}>
          {showEmptyOption ? <option value="">{getWords().PLEASE_SELECT_OPTION}</option> : null}
          {isImmutable ? (
            <ImmutableListOfOptions 
              list={list}
              nameKey={nameKey}
              valueKey={valueKey}  
            />
          ) : (
            list.map(({ [valueKey]: optionValue, [nameKey]: optionName }: any) => (
              <option
                key={optionValue} 
                value={optionValue}>
                {optionName}
              </option>
            ))
          )}
        </select>
        {
          !props.hideError && showError ? (
            <span className="text-danger">{theError}</span>
          ) : null
        }
      </>
    );
  };

export const RawSimpleSelect = React.memo(SimpleSelectInner);
