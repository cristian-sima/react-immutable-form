import { ro } from "date-fns/locale";
import Immutable from "immutable";
import React from "react";
import DatePicker from "react-datepicker";
import { dateToGoFormat, golangDateToMoment } from "x25/utility";
import { FieldRendererProps, HandleChangeFunc } from "../types";

export type DateTemplatePropTypes = FieldRendererProps<HTMLInputElement> & {
  readonly customClass?: any;
  readonly customOnChange: (date : Date, handleDateChanged : () => void, handleChange : HandleChangeFunc) => any;
};

export const 
  DateInputInner = (props: DateTemplatePropTypes) => {
    const
      { hideError, customClass, name, data = Immutable.Map() } = props,
      renderCount = React.useRef(0),
      value = data.get("value") || "",
      meta = data.get("meta") || Immutable.Map(),
      theError = meta.get("theError") as string | undefined,
      isTouched = meta.get("isTouched") as boolean,

      datePickerProps = React.useMemo(() => props.componentProps, [props.componentProps]),
      
      hasError = typeof theError !== "undefined",
      defaultClass = "form-control w-110",
      showError = isTouched && hasError,
      theClass = `${showError ? "is-invalid" : ""} ${customClass ? customClass : defaultClass}`,

      theValue = React.useMemo(() => {
        const momentObj = golangDateToMoment(value);

        if (momentObj.isValid()) {
          const selectedDate = momentObj.toDate();

          selectedDate.setHours(0, 0, 0, 0);
          return selectedDate;
        }

        return "";
      }, [value]),

      handleFocus = (event : React.FocusEvent<HTMLInputElement, Element>) => {
        if (typeof props.customOnFocus === "function") {
          props.customOnFocus(event, props.handleFocus, name);
        } else {
          props.handleFocus(name);
        }
      }, 
      handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        if (typeof props.customOnBlur === "function") {
          props.customOnBlur(event, props.handleBlur, name);
        } else {
          props.handleBlur(name);
        }
      },
      handleChange =  (date: Date) => {
        const dateOnChange = () => {
          props.handleChange(name, dateToGoFormat(date));
        };

        if (typeof props.customOnChange === "function") {
          props.customOnChange(date, dateOnChange, props.handleChange);
        } else {
          dateOnChange();
        }
      };


    React.useEffect(() => {
      renderCount.current += 1;
    });

    return (
      <>
        <DatePicker
          className={theClass}
          dateFormat="dd.MM.yyyy"
          id={props.name}
          locale={ro}
          name={props.name}
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          selected={theValue}
          {...datePickerProps}
        />
        {
          !hideError && showError ? (
            <span className="text-danger">{theError}</span>
          )  : null 
        }
      </>
    );
  };

export const RawDateInput = React.memo(DateInputInner);
