/* eslint-disable camelcase */
import Immutable from "immutable";
import React, { useContext } from "react";
import FieldRender from "./FieldRender";
import FormContext from "./context";
import { FieldProps, FieldRendererProps, ID_FieldName, INDEX_FieldName } from "./types";
import { getNodesFromString, getRealPath } from "./util";

const 
  FieldInner = <T extends HTMLElement>(props: FieldProps<T>) => {
    const
      { hideError, inputProps, component, validate, index, listName, ID,  componentProps } = props,
      form = useContext(FormContext),
      fieldName = props.name,
      hasIndex = typeof index !== "undefined",
      indexPath = (hasIndex ? `${listName}.${index}.${fieldName}`: fieldName) as INDEX_FieldName,
      nodes = React.useMemo(() => getRealPath(getNodesFromString(indexPath)), [indexPath]),
      data = form.formState.getIn(nodes) as Immutable.Map<string, any> || Immutable.Map(),
      idFileName = React.useMemo(() => (
        (hasIndex ? `${listName}.${ID}.${fieldName}` : fieldName) as ID_FieldName
      ), [hasIndex, listName, ID, fieldName]),
      isSubmitting = form.management.get("isSubmitting") as boolean,
  
      passedProps = React.useMemo(() => {
        const
          theProps : FieldRendererProps<T> = {
            hideError,
            componentProps : props.componentProps,
            disabled       : isSubmitting,
            elementProps   : inputProps,
            indexFileName  : indexPath,
            idFileName,
            data,
            handleBlur     : form.handleBlur,
            handleChange   : form.handleChange,
            handleFocus    : form.handleFocus,
          };

        return theProps;
      } , [componentProps, isSubmitting, indexPath, data, listName, index, hideError]),
  
      memoizedFieldRenderer = React.useMemo(() => (
        component ? React.createElement(component, passedProps) : (
          <FieldRender {...passedProps as any} />
        )
      ), [component, passedProps]);

    React.useEffect(() => {      
      form.registerField(idFileName, indexPath);
  
      if (validate) {
        form.setFieldValidator(idFileName, validate);
      }
  
      return () => form.unregisterField(idFileName, indexPath);
    }, []);
  
    return memoizedFieldRenderer;
  },

  /**
   * Field component.
   * 
   * This component renders a form field and manages its state, validation, and event handling. It supports
   * custom components for rendering and handles the registration and unregistration of the field within the form context.
   * It memories the props using React.memo
   * 
   * @template T - The type of the HTML element for the field.
   * 
   * @param {Object} props - Component properties.
   * @param {string} props.name - The name of the field.
   * @param {boolean} [props.hideError] - Whether to hide the error message.
   * @param {Object} [props.inputProps] - Props to pass to the input element.
   * @param {React.ComponentType<FieldRendererProps<T>>} [props.component] - Custom component to render the field.
   * @param {Function} [props.validate] - Validation function for the field.
   * @param {number} [props.index] - Index of the field in a list.
   * @param {string} [props.listName] - Name of the list containing the field.
   * @param {string} props.ID - Unique identifier for the field.
   * @param {Object} [props.componentProps] - Additional props to pass to the custom component.
   * 
   * @returns {JSX.Element} The Field component.
   */
  Field = React.memo(FieldInner);

export default Field;
