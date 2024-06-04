

import Immutable from "immutable";
import React from "react";
import { RawSimpleSelect, SimpleSelectProps } from "./SimpleSelect";
import { getTemplateInfo } from "./util";

const SelectTemplateInner = (props: SimpleSelectProps) => {
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
        <RawSimpleSelect {...props} />
      </div>
    </div>
  );
};

export const RawSelectTemplate = React.memo(SelectTemplateInner);