

import Immutable from "immutable";
import React from "react";
import { DateTemplatePropTypes, RawDateInput } from "./DateInput";
import { getTemplateInfo } from "./util";

const DateTemplateInner = (props: DateTemplatePropTypes) => {
  const
    { componentProps = Immutable.Map()  } = props,
    theError = props.data.getIn(["meta", "theError"]),
    hasError = typeof theError !== "undefined",
    { leftClass, rightClass, label } = React.useMemo(() => (
      getTemplateInfo(componentProps)
    ), [componentProps]);

  return (
    <div className="row">
      <label className={leftClass} htmlFor={props.name}>
        {label}
      </label>
      <div className={rightClass}>
        <RawDateInput {...props} />
        {!props.hideError && hasError ? (
          <div className="invalid-feedback">
            {theError}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const RawDateTemplate = React.memo(DateTemplateInner);