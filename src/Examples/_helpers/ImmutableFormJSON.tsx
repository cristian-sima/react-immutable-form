import { JSONSyntaxFromData } from "Sidenote/core/Common/Syntax";
import React from "react";

type ImmutableFormJSONProps = {
  readonly formData: Immutable.Map<string, any>;
}

const 
  ImmutableFormJSON = ({ formData } : ImmutableFormJSONProps) => {
    const height = 400;
    
    return (
      <div className="container mt-2 text-start">
        <div className="row">
          <div className="col-4">
            {"Validators: "}
            <JSONSyntaxFromData data={formData.get("state")} height={height} />
          </div>
          <div className="col-4">

            {"Management: "}
            <JSONSyntaxFromData data={formData.get("management")} height={height} />
          </div>
          <div className="col-4">

            {"Derived state: "}
            <JSONSyntaxFromData data={formData.get("derived")} height={height} />
          </div>
        </div>
      </div>
    );
  };

export default ImmutableFormJSON;