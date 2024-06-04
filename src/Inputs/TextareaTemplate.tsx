

import Immutable from "immutable";
import React from "react";
import { RawSimpleTextarea, SimpleTextareaProps } from "./SimpleTextarea";
import { getTemplateInfo } from "./util";

const TextareaTemplateInner = (props: SimpleTextareaProps) => {
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
        <RawSimpleTextarea {...props} />
      </div>
    </div>
  );
};

export const RawTextareaTemplate = React.memo(TextareaTemplateInner);