/* eslint-disable new-cap */
/* eslint-disable no-magic-numbers */
import Immutable from "immutable";
import { describe, expect, test } from "vitest";
import { Decorator, INDEX_FieldName, ImmutableFormState } from "../types";
import { DEFAULT_VALUE_NO_ERROR, getDefaultField, getNodesFromString, getRealPath } from "../util";
import { FieldOnChangeUpdaters } from "./field-onChange";


describe("Field onChange", () => {
  describe("FieldOnChangeUpdaters.dependenciesUpdater", () => {
    const getInitialState = () => Immutable.fromJS({
      state: {
        field1: {
          value : "updatedValue",
          meta  : {
            theError: undefined,
          },
        },
        field2: {
          value : "",
          meta  : {
            theError: undefined,
          },
        },
      },
      validationDependencies: {
        "field1" : ["field2"],
        "field2" : [],
      },
      validators: Immutable.Map({
        field1 : (value : any) => (value === "updatedValue" ? "Invalid value" : undefined),
        field2 : (value : any, allValues : ImmutableFormState) => {
          const field1Value = allValues.getIn(["state", "field1", "value"]) === "updatedValue";

            
          if (field1Value) {
            return "field-2-error";
          }
    
          return undefined;
        },
      }),
      management: {
        dirtyFields: Immutable.Set(),
      },
    }) as ImmutableFormState;
      
    test("Field1 has a validation dep to Field2, when it calls, it updates it validation", () => {
      const 
        initialFormData = getInitialState(),
        indexFieldName = "field1" as INDEX_FieldName,
        nodes = getRealPath(getNodesFromString(indexFieldName)),
        updater = (givenFormData : ImmutableFormState) => FieldOnChangeUpdaters.dependenciesUpdater({
          givenFormData,
          indexFieldName,
          value: "updatedValue",
          nodes,
        }),
        updatedFormData = initialFormData.withMutations(updater);

      expect(updatedFormData.getIn(["state", "field2", "meta", "theError"])).toEqual("field-2-error");
    });

    test("Field3 does not have validation deps, so it does not change the state", () => {
      const 
        indexFieldName = "field3" as INDEX_FieldName,
        initialFormData = getInitialState() as ImmutableFormState,
        nodes = getRealPath(getNodesFromString(indexFieldName)),
        updater = (givenFormData : ImmutableFormState) => FieldOnChangeUpdaters.dependenciesUpdater({
          givenFormData,
          indexFieldName,
          value: "updatedValue",
          nodes,
        }),
        updatedFormData = initialFormData.withMutations(updater);

      expect(updatedFormData).toEqual(initialFormData);
    });
  });

  describe("FieldOnChangeUpdaters.stateUpdater", () => {
    const getInitialState = () => Immutable.fromJS({
      state: {
        field1: {
          value : "value1",
          meta  : {
            initialValue : "value1",
            theError     : undefined,
          },
        },
        field2: {
          value : "",
          meta  : {
            theError: undefined,
          },
        },
      },
      validators: Immutable.Map({
        field1 : (value : any) => (value === "updatedValue" ? "Invalid value" : undefined),
        field2 : (value : any, allValues : ImmutableFormState) => {
          const field1Value = allValues.getIn(["state", "field1", "value"]) === "updatedValue";
  
              
          if (field1Value) {
            return "field-2-error";
          }
      
          return undefined;
        },
      }),
    }) as ImmutableFormState;

    describe("the state does not have the field", () => {
      test("it creates a new field in the state", () => {
        const 
          initialFormData = getInitialState(),
          indexFieldName = "field3" as INDEX_FieldName,
          nodes = getRealPath(getNodesFromString(indexFieldName)),
          updater = (givenFormData : ImmutableFormState) => FieldOnChangeUpdaters.stateUpdater({
            givenFormData,
            indexFieldName,
            value: "value-for-field3",
            nodes,
          }),
          updatedFormData = initialFormData.withMutations(updater);
  
        expect(updatedFormData.getIn(["state", indexFieldName])).toEqual(
          getDefaultField(indexFieldName, "value-for-field3"),
        );
      });
    });

    describe("the state has the field", () => {
      describe("the isDirty flag is correctly set", () => {
        test("for changing value to its initial, it sets the isDirty to false", () => {
          const 
            initialFormData = getInitialState(),
            indexFieldName = "field1" as INDEX_FieldName,
            nodes = getRealPath(getNodesFromString(indexFieldName)),
            updater = (givenFormData : ImmutableFormState) => FieldOnChangeUpdaters.stateUpdater({
              givenFormData,
              indexFieldName,
              value: "value1",
              nodes,
            }),
            updatedFormData = initialFormData.withMutations(updater);
          
          expect(updatedFormData.getIn(["state", "field1", "value"])).toEqual("value1");
          expect(updatedFormData.getIn(["state", "field1", "meta", "isDirty"])).toEqual(false);
        });
          
        test("for changing value to its initial, it sets the isDirty to false", () => {
          const 
            initialFormData = getInitialState(),
            indexFieldName = "field1" as INDEX_FieldName,
            nodes = getRealPath(getNodesFromString(indexFieldName)),
            updater = (givenFormData : ImmutableFormState) => FieldOnChangeUpdaters.stateUpdater({
              givenFormData,
              indexFieldName,
              value: "updatedValue",
              nodes,
            }),
            updatedFormData = initialFormData.withMutations(updater);
          
          expect(updatedFormData.getIn(["state", "field1", "value"])).toEqual("updatedValue");
          expect(updatedFormData.getIn(["state", "field1", "meta", "isDirty"])).toEqual(true);
        });
      });

      describe("the validation is done when it is changed", () => {
        test("field 1 is validated and changed", () => {
          const 
            initialFormData = getInitialState(),
            indexFieldName = "field1" as INDEX_FieldName,
            nodes = getRealPath(getNodesFromString(indexFieldName)),
            updater = (givenFormData : ImmutableFormState) => FieldOnChangeUpdaters.stateUpdater({
              givenFormData,
              indexFieldName,
              value: "updatedValue1",
              nodes,
            }),
            updatedFormData = initialFormData.withMutations(updater);
      
          expect(updatedFormData.getIn(["state", "field1", "value"])).toEqual("updatedValue1");
          expect(updatedFormData.getIn(["state", "field1", "meta", "theError"])).toEqual(DEFAULT_VALUE_NO_ERROR);
        });
      
        test("field 1 fails validation", () => {
          const 
            initialFormData = getInitialState(),
            indexFieldName = "field1" as INDEX_FieldName,
            nodes = getRealPath(getNodesFromString(indexFieldName)),
            updater = (givenFormData : ImmutableFormState) => FieldOnChangeUpdaters.stateUpdater({
              givenFormData,
              indexFieldName,
              value: "updatedValue",
              nodes,
            }),
            updatedFormData = initialFormData.withMutations(updater);
      
          expect(updatedFormData.getIn(["state", "field1", "value"])).toEqual("updatedValue");
          expect(updatedFormData.getIn(["state", "field1", "meta", "theError"])).toEqual("Invalid value");
        });
      });
    });

  });

  describe("FieldOnChangeUpdaters.managementUpdater", () => {
    const getInitialState = () => Immutable.fromJS({
      state: {
        field1: {
          value       : "value1",
          idFieldName : "field1",
          meta        : {
            initialValue : "value1",
            theError     : undefined,
          },
        },
        field2: {
          value       : "",
          idFieldName : "field2",
          meta        : {
            theError     : undefined,
            initialValue : "",
            isDirty      : false,
          },
        },
      },
      validators: Immutable.Map({
        field1 : (value : any) => (value === "updatedValue" ? "Invalid value" : undefined),
        field2 : (value : any, allValues : ImmutableFormState) => {
          const field1Value = allValues.getIn(["state", "field1", "value"]) === "updatedValue";
  
              
          if (field1Value) {
            return "field-2-error";
          }
      
          return undefined;
        },
      }),
    }) as ImmutableFormState;

    describe("the form does not have the field", () => {
      test("dirtyFieldsUpdater does nothing", () => {
        const 
          initialFormData = getInitialState(),
          indexFieldName = "field4" as INDEX_FieldName,
          nodes = getRealPath(getNodesFromString(indexFieldName)),
          updater = (givenFormData : ImmutableFormState) => FieldOnChangeUpdaters.managementUpdater({
            givenFormData,
            indexFieldName,
            value: "value-for-field4",
            nodes,
          }),
          updatedFormData = initialFormData.withMutations(updater);
  
        expect(updatedFormData).toEqual(initialFormData);
      });
    });

    describe("the form has the field", () => {
      describe("if the field is dirty", () => {
        test("if the field is not in the list, add it", () => {
          const 
            initialFormData = getInitialState(),
            indexFieldName = "field1" as INDEX_FieldName,
            nodes = getRealPath(getNodesFromString(indexFieldName)),
            updater = (givenFormData : ImmutableFormState) => FieldOnChangeUpdaters.managementUpdater({
              givenFormData,
              indexFieldName,
              value: "value-for-field4",
              nodes,
            }),
            updatedFormData = initialFormData.withMutations(updater);
    
          expect(updatedFormData.getIn(["management", "dirtyFields"])).toEqual(
            Immutable.Set([indexFieldName]),
          );
        });
        
        test("if the field is in the list, ignore it", () => {
          const 
            initialFormData = getInitialState(),
            indexFieldName = "field1" as INDEX_FieldName,
            nodes = getRealPath(getNodesFromString(indexFieldName)),
            updater = (givenFormData : ImmutableFormState) => FieldOnChangeUpdaters.managementUpdater({
              givenFormData,
              indexFieldName,
              value: "value-for-field4",
              nodes,
            }),
            innerData1 = initialFormData.withMutations(updater),
            innerData2 = innerData1.withMutations(updater),
            innerData3 = innerData2.withMutations(updater),
            innerData4 = innerData3.withMutations(updater),
            updatedFormData = innerData4.withMutations(updater),
            
            expectedList = updatedFormData.getIn(["management", "dirtyFields"]) as any;

          expect(expectedList?.size).toEqual(1);
          expect(expectedList?.first()).toEqual("field1");
    
        });
      
      });
      describe("if the field is not dirty", () => {
        test("if the field is not in the list, ignore it", () => {
          const 
            indexFieldName = "field2" as INDEX_FieldName,
            initialFormData = getInitialState().setIn(["management", "dirtyFields"], (
              Immutable.Set(["field3", "field1"])
            )),
            nodes = getRealPath(getNodesFromString(indexFieldName)),
            updater = (givenFormData : ImmutableFormState) => FieldOnChangeUpdaters.managementUpdater({
              givenFormData,
              indexFieldName,
              value: "",
              nodes,
            }),
            updatedFormData = initialFormData.withMutations(updater),
            expectedList = updatedFormData.getIn(["management", "dirtyFields"]) as any;

          expect(expectedList?.size).toEqual(2);
        });

        test("if the field is in the list, remove it", () => {
          const 
            indexFieldName = "field2" as INDEX_FieldName,
            initialFormData = getInitialState().setIn(["management", "dirtyFields"], (
              Immutable.Set(["field2", "field1"])
            )),
            nodes = getRealPath(getNodesFromString(indexFieldName)),
            updater = (givenFormData : ImmutableFormState) => FieldOnChangeUpdaters.managementUpdater({
              givenFormData,
              indexFieldName,
              value: "",
              nodes,
            }),
            updatedFormData = initialFormData.withMutations(updater),
            expectedList = updatedFormData.getIn(["management", "dirtyFields"]) as any;

          expect(expectedList?.size).toEqual(1);
          expect(expectedList?.first()).toEqual("field1");
        });
      
      });
    });
  });

  describe("Apply Decorators", () => {
    const getInitialValues = () => {
      const 
        createSpy = () => {
          const calls: any[] = [],
            spy = (...args: any[]) => {
              calls.push(args);
            };
    
          spy.calls = calls;
          return spy;
        },
          
        mockDecorator: any = createSpy();
          
      return {
        givenFormData: Immutable.fromJS({
          decorators: Immutable.Map<string, Decorator>({
            "field1": mockDecorator,
          }),
        }),
        mockDecorator,
      };
    };
      
    describe("FieldOnChangeUpdaters.applyDecorators", () => {
      test("Decorator called when found", () => {
        const    
          { mockDecorator, givenFormData }   =  getInitialValues(),
          options = {
            nodes          : Immutable.List(["field1"]),
            value          : "updatedValue",
            indexFieldName : "field1" as INDEX_FieldName,
            givenFormData,
          };

        FieldOnChangeUpdaters.applyDecorators(options);
      
        const decoratorOptions: any = { 
          formData       : options.givenFormData,
          indexFieldName : options.indexFieldName, 
          value          : options.value,
          nodes          : options.nodes,
        };

        expect(mockDecorator.calls).toHaveLength(1);
        expect(mockDecorator.calls[0]).toEqual([decoratorOptions]);
      });
      
      test("Decorator not called when not found", () => {
        
        const      
          { mockDecorator, givenFormData }   =  getInitialValues(),
          options = {
            nodes          : Immutable.List(["field1"]),
            value          : "updatedValue",
            indexFieldName : "field7"  as INDEX_FieldName,
            givenFormData ,
          },
          optionsWithoutDecorator = { ...options, field: "field2" as INDEX_FieldName };

        FieldOnChangeUpdaters.applyDecorators(optionsWithoutDecorator);

        expect(mockDecorator.calls).toHaveLength(0);
      });
    });

  });
});
