

import Immutable from "immutable";
import React from "react";
import { RawSimpleInput, SimpleInputProps } from "./SimpleInput";
import { getTemplateInfo } from "./util";

type InputTemplatePropTypes = SimpleInputProps

export const RawInputTemplate = (props: InputTemplatePropTypes) => {
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
        <RawSimpleInput {...props} />
      </div>
    </div>
  );
};