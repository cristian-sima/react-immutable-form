import { ImmutableField } from "Sidenote/_Form/iform";
import { SimpleSelect } from "Sidenote/_Form/src";
import { ImmutableListOfOptions } from "Sidenote/_Form/src/Inputs/SimpleSelect";
import Immutable from "immutable";
import Tooltip from "rc-tooltip";
import React from "react";
import { toNumeric, words } from "x25/utility";

type CommonFieldProps = {
  readonly submitting: boolean;
  readonly name?: string;
  readonly forceSetTheSingleValue?: boolean;
}

const
  validateNumericSelect = (value : any) => (
    typeof value === "number" && 
    value !== 0
  ) ? undefined : words.PleaseSelect,
  CustomInput = (props : CommonFieldProps) => {
    const
      { submitting }  = props,
      list = Immutable.List<Immutable.Map<string, any>>(),
      showDelegatesModalHandle = () => {},
      showCreateDelegate = () => {},
      fieldName = props.name ? props.name : "DelegateID";

    return (
      <ImmutableField<HTMLSelectElement>
        name={fieldName} 
        parse={toNumeric}
        render={(inputProps) => {
          const 
            meta = (inputProps.data.get("meta") || Immutable.Map()) as Immutable.Map<string, any>,
            theError = meta.get("theError"),
            isTouched = meta.get("isTouched"),
            hasError = typeof theError !== "undefined",
            componentProps = React.useMemo(() => {
              const inner : ImmutableListOfOptions = {
                isImmutable     : true,
                nameKey         : "FullName",
                list,
                showEmptyOption : list.size !== 1,
                valueKey        : "ID" ,
              };

              return Immutable.Map<string, any>(inner);
            }, [list]),
            elementProps = {
              ...inputProps.elementProps,
              label       : "Nume delegat",
              placeholder : "ex. Delegat",
            };

          React.useEffect(() => {
            if (list && props.forceSetTheSingleValue && list.size === 1) {
              const theValue = list.first()?.get("ID") || 0;

              inputProps.handleChange(fieldName, theValue);
            }
          }, [list, props.forceSetTheSingleValue]);
  
          return (
            <div className="mb-2">
              {list.size === 0 ? (
                <div className="text-end">
                  {hasError && isTouched ? (
                    <div className="alert alert-danger text-center">
                      {"Trebuie să crezi un delegat"}
                      <button
                        className="btn btn-link"
                        onClick={showCreateDelegate}
                        type="button">
                        <i className="fa fa-plus me-1 text-success" />
                        {"Crează un delegat"}
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-link"
                      onClick={showCreateDelegate}
                      type="button">
                      <i className="fa fa-plus me-1 text-success" />
                      {"Crează un delegat"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="container">
                  <div className="row">
                    <div className="col-lg-4 text-lg-end small">
                      {"Delegat"}
                    </div>
                    <div className="col-lg-8">
                      <div className="input-group">
                        <SimpleSelect
                          {...inputProps}
                          componentProps={componentProps}
                          customClass="form-select form-select-sm"
                          disabled={submitting}
                          elementProps={elementProps}
                          hideError
                        />
                        <Tooltip
                          destroyTooltipOnHide
                          overlay="Modifică delegații"
                          placement="left"
                          showArrow={false}>
                          <button
                            className="btn btn-secondary btn-sm"
                            disabled={submitting}
                            onClick={showDelegatesModalHandle}
                            tabIndex={-1}
                            type="button">
                            <i className="fa fa-pencil" />
                          </button>
                        </Tooltip>
                      </div>
                      {
                        hasError ? (
                          <span className="text-danger">
                            {theError}
                          </span> 
                        ): null 
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>);
        }}
        validate={validateNumericSelect}
      />
    );
  };

export default CustomInput;
