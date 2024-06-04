

import Immutable from "immutable";
import React from "react";
import { InputTemplatePropTypes, RawNumericInput } from "./NumericInput";
import { getTemplateInfo } from "./util";

const NumericTemplateInner = (props: InputTemplatePropTypes) => {
  const
    { componentProps = Immutable.Map()  } = props,
    { leftClass, rightClass, label } = React.useMemo(() => (
      getTemplateInfo(componentProps)
    ), [componentProps]);

  return (
    <div className="row">
      <label className={leftClass} htmlFor={props.name}>
        {label}
      </label>
      <div className={rightClass}>
        <RawNumericInput {...props} />
      </div>
    </div>
  );
};

export const RawNumericTemplate = React.memo(NumericTemplateInner);