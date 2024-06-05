/* eslint-disable new-cap */

import Immutable from "immutable";
import { Decorator, DependenciesValidationList, ImmutableFormDecorators, ImmutableFormState, ImmutableFormValidationDependencies, ImmutableFormValidators } from "../types";
import { FieldEventOnChangeAction } from "../types-actions";
import { getDefaultField, getNodesFromString, getRealPath, performValidation } from "../util";


export const 
  handleOnChange = (formData : ImmutableFormState, action : FieldEventOnChangeAction) => {
    const 
      validators = formData.get("validators") as ImmutableFormValidators,
      decorators = formData.get("decorators") as ImmutableFormDecorators,
      { value, field } = action.payload,
      nodes = getRealPath(getNodesFromString(field)),
      applyDecorators = (givenFormData : ImmutableFormState) => {
        const 
          getDecoratorPath = () => {
            if (nodes.size === 1) {
              return field;
            }
  
            return `${nodes.first()}.${nodes.last()}`;
          },
          decorator = decorators.get(getDecoratorPath()) as Decorator ;

        if (!decorator) {
          return;
        }

        const decoratorOptions = { 
          formData: givenFormData,
          field, 
          value,
          nodes,
        };

        decorator(decoratorOptions);
      },
      stateUpdater = (formState : Immutable.Map<string, Immutable.Map<string, any>>) => {
        const
          validatorErr = performValidation(validators, nodes, value, formState),
          elementUpdater = (currentNode : Immutable.Map<string, any> | undefined) => {
            if (typeof currentNode === "undefined") {
              return getDefaultField(field, value);
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
          },

          updatedState = formState.updateIn(nodes, (
            (inner : any) => elementUpdater(inner as Immutable.Map<string, any> | undefined)
          )),

          dependenciesUpdater = (givenState : Immutable.Map<string, any>) => {
            const 
              validationDependencies = formData.get("validationDependencies") as ImmutableFormValidationDependencies,
              source = validationDependencies.get(field) as DependenciesValidationList | undefined,
              performValidationDependenciesCheck = (theSource : DependenciesValidationList) => (
                theSource.reduce((acc, target) => {
                  const 
                    targetValue = acc.getIn([target, "value"]) as any,
                    targetNodes = getRealPath(getNodesFromString(field)),
                    targetErr = performValidation(validators, targetNodes, targetValue, acc),
                    errorNodes = [target, "meta", "theError"];

                  return acc.setIn(errorNodes, targetErr);
                }, givenState)
              );

            if (Immutable.List.isList(source)) {
              return performValidationDependenciesCheck(source);
            }

            return givenState;
          };

        return dependenciesUpdater(updatedState);             
      },
      managementUpdater = (management : Immutable.Map<string, any>) => {
        const 
          dirtyFieldsUpdater = (current : Immutable.Set<string> = Immutable.Set<string>()) => {
            if (typeof current === "undefined") {
              return current;
            }
          
            const 
              currentNode = formData.getIn(["state", ...nodes]) as Immutable.Map<string, any>;

            if (typeof currentNode === "undefined") {
              return currentNode; 
            }
            
            const 
              initialValue = currentNode.getIn(["meta", "initialValue"]),
              idPath = currentNode.get("path"),
              isDirty =  initialValue !== value;

            if (isDirty) {
              return current.add(idPath);
            }
                            
            return current.delete(idPath);
          };

        return management.update("dirtyFields", dirtyFieldsUpdater);
      };

    return formData
      .update("state", stateUpdater) 
      .update("management", managementUpdater)
      .withMutations(applyDecorators);
  };