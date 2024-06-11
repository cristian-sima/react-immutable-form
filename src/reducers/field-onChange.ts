/* eslint-disable new-cap */

import Immutable from "immutable";
import { Decorator, DecoratorOptions, DependenciesValidationList, INDEX_FieldName, ImmutableFormDecorators, ImmutableFormState, ImmutableFormValidationDependencies, ImmutableFormValidators, Nodes } from "../types";
import { FieldEventOnChangeAction } from "../types-actions";
import { getDefaultField, getNodesFromString, getRealPath, performValidation } from "../util";

export type onChangeGenericWrapperOptions = {
  indexFieldName: INDEX_FieldName;
  nodes: Nodes;
  value: any;
  /*** 
   * it is Immutable.withMutations
   */
  givenFormData : ImmutableFormState; 
}

type applyDecoratorsOptions = onChangeGenericWrapperOptions 
type managementUpdaterOptions = onChangeGenericWrapperOptions
type stateUpdaterOptions = onChangeGenericWrapperOptions 
type dependenciesUpdaterOptions = stateUpdaterOptions

export class FieldOnChangeUpdaters {
  static dependenciesUpdater = (options : dependenciesUpdaterOptions) => {
    const 
      { givenFormData, indexFieldName } = options,
      validators = givenFormData.get("validators") as ImmutableFormValidators,
      validationDependencies = givenFormData.get("validationDependencies") as ImmutableFormValidationDependencies,
      formState = givenFormData.get("state") as ImmutableFormState,
      source = validationDependencies.get(indexFieldName) as DependenciesValidationList | undefined,
      performValidationDependenciesCheck = (theSource : DependenciesValidationList) => (
        theSource.forEach((target) => {
          const 
            targetNodes = getRealPath(getNodesFromString(target)),
            targetValue = formState.getIn(["state", ...targetNodes, "value"]) as any,
            targetErr = performValidation(validators, targetNodes, targetValue, givenFormData),
            errorNodes = ["state", ...targetNodes, "meta", "theError"];

          givenFormData.setIn(errorNodes, targetErr);
        })
      );
    
    if (Immutable.List.isList(source)) {      
      performValidationDependenciesCheck(source);
    }
  };

  static stateUpdater = (options : stateUpdaterOptions) => {
    const
      { givenFormData, nodes, value, indexFieldName } = options,
      validators = givenFormData.get("validators") as ImmutableFormValidators,
      formState = givenFormData.get("state"),
      validatorErr = performValidation(validators, nodes, value, formState),
      elementUpdater = (currentNode : Immutable.Map<string, any> | undefined) => {
        if (typeof currentNode === "undefined") {
          return getDefaultField(indexFieldName, value);
        }

        const 
          initialValue = currentNode.getIn(["meta", "initialValue"]) as any,
          isDirty =  initialValue !== value,
          nodeDeepMerger = Immutable.fromJS({
            value,
            meta: Immutable.Map({
              theError: validatorErr,
              isDirty   ,
            }),
          });
  
        return currentNode.mergeDeep(nodeDeepMerger);
      };

    givenFormData.updateIn(["state", ...nodes], (
      (inner : any) => elementUpdater(inner as Immutable.Map<string, any> | undefined)
    ));            
  };

  static managementUpdater = (options : managementUpdaterOptions) => {
    const 
      { givenFormData, nodes, value } = options,
      dirtyFieldsUpdater = (current : Immutable.Set<string> = Immutable.Set<string>()) => {
        if (typeof current === "undefined") {
          return current;
        }
          
        const 
          currentNode = givenFormData.getIn(["state", ...nodes]) as Immutable.Map<string, any>;

        if (typeof currentNode === "undefined") {
          return currentNode; 
        }
            
        const 
          initialValue = currentNode.getIn(["meta", "initialValue"]) as any,
          idPath = currentNode.get("path") as string,
          isDirty =  initialValue !== value;

        if (isDirty) {
          return current.add(idPath);
        }
                            
        return current.delete(idPath);
      };

    givenFormData.updateIn(["management", "dirtyFields"], (innerValue : any) => (
      dirtyFieldsUpdater(innerValue as Immutable.Set<string>)
    ));
  };

  static applyDecorators = (options : applyDecoratorsOptions) => {
    const 
      { nodes, value, indexFieldName, givenFormData } = options,
      decorators = givenFormData.get("decorators") as ImmutableFormDecorators,
      getDecoratorPath = () => {
        if (nodes.size === 1) {
          return indexFieldName;
        }

        return `${nodes.first()}.${nodes.last()}`;
      },
      decorator = decorators.get(getDecoratorPath()) as Decorator ;

    if (!decorator) {
      return;
    }

    const decoratorOptions : DecoratorOptions = { 
      formData: givenFormData,
      indexFieldName, 
      value,
      nodes,
    };

    decorator(decoratorOptions);
  };
}

export const 
  handleOnChange = (initialFormData : ImmutableFormState, action : FieldEventOnChangeAction) => {
    const 
      formDataUpdater = (givenFormData : ImmutableFormState) => {
        const 
          { value, indexFieldName } = action.payload,
          nodes = getRealPath(getNodesFromString(indexFieldName)),
         
          options : stateUpdaterOptions = {
            givenFormData,
            value,
            indexFieldName, 
            nodes,
          },
          updaters = [
            FieldOnChangeUpdaters.stateUpdater, 
            FieldOnChangeUpdaters.dependenciesUpdater, 
            FieldOnChangeUpdaters.managementUpdater, 
            FieldOnChangeUpdaters.applyDecorators, 
          ];

        updaters.forEach((updater) => updater(options));
      };

    return initialFormData.withMutations(formDataUpdater);
  };