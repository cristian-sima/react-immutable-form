import React from "react";
import { ImmutableForm } from "../..";
import { onSubmitImmutableFormFunc } from "../../types";
import ImmutableFormJSON from "../_helpers/ImmutableFormJSON";
import CustomInput from "./CustomInput";


const 
  CustomInputRender = () => {
    const 
      onSubmit : onSubmitImmutableFormFunc = (values) => 
        new Promise(() => {
          // eslint-disable-next-line no-alert
          alert(values);
        });

    return (
      <div className="m-3 p-3 alert alert-secondary">
        <ImmutableForm onSubmit={onSubmit}>
          {(form) => {
            const 
              { handleSubmit, management } = form,
              isSubmitting = management.get("isSubmitting");

            return (
              <form onSubmit={handleSubmit}>
                <CustomInput
                  name="DelegateID"
                  submitting={isSubmitting} />
                <div className="text-center">
                  <button
                    className="btn btn-primary"
                    type="submit">
                    {"Submit"}
                  </button>
                </div>
                <ImmutableFormJSON formData={form.getFormData()} />
              </form>
            );
          }}
        </ImmutableForm>
      </div>
    );
  };

export default CustomInputRender;