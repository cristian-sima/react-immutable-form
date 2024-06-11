/* eslint-disable no-magic-numbers */
/* eslint-disable new-cap */
// FieldRegisterUpdaters.test.ts
import Immutable from "immutable";
import { describe, expect, it } from "vitest";
import { ID_FieldName, INDEX_FieldName, ImmutableFormState, Nodes } from "../types";
import { REFERENCES_PATH, getDefaultField, getNodesFromString, getRealPath } from "../util";
import { FieldRegisterUpdaters, handleRegisterField } from "./field-register";
import { FieldEventRegisterFieldAction } from "src/types-actions";

describe("FieldRegisterUpdaters", () => {
  describe("stateUpdater", () => {
    describe("should handle single node case", () => {
      const 
        idFieldName: ID_FieldName = "testField" as ID_FieldName,
        indexFieldName: INDEX_FieldName = "testField" as INDEX_FieldName;

      it("does not change the state, if the field exists", () => {
        const
          nodes: Nodes = Immutable.List(["testField"]),
          formDataWithMutations = Immutable.Map({
            state: Immutable.Map({
              "testField": Immutable.Map({}),
            }),
          }),

          options = {
            nodes,
            formDataWithMutations,
            idFieldName,
            indexFieldName,
          };

        FieldRegisterUpdaters.stateUpdater(options);

        expect(formDataWithMutations).toEqual(formDataWithMutations);
      });

      it("changes the state, if the field does not exist", () => {
        const
          nodes: Nodes = Immutable.List(["testField"]),
          formDataWithMutations = Immutable.Map({
            state: Immutable.Map({}),
          }),

          options = {
            nodes,
            formDataWithMutations,
            idFieldName,
            indexFieldName,
          },
          expectedState = Immutable.Map({
            state: Immutable.Map({
              testField: getDefaultField(idFieldName, ""),
            }),
          }),
          newState =  formDataWithMutations.withMutations((inner) => FieldRegisterUpdaters.stateUpdater({
            ...options,
            formDataWithMutations: inner,
          }));

        expect(newState).toEqual(expectedState);
      });
    });

    describe("should handle list case", () => {
      const 
        idFieldName: ID_FieldName = "item.ABC.name" as ID_FieldName,
        indexFieldName: INDEX_FieldName = "items.0.name" as INDEX_FieldName;
         
      it("changes the state, if it does not has this node", () => {
        const
          nodes: Nodes = getRealPath(getNodesFromString(idFieldName)),
          formDataWithMutations = Immutable.Map({
            state: Immutable.Map({}),
          }),

          options = {
            nodes,
            formDataWithMutations,
            idFieldName,
            indexFieldName,
          },
          expectedState = Immutable.Map({
            "state": Immutable.Map({
              "items": Immutable.Map({
                "0": Immutable.Map({
                  "VALUES": Immutable.Map({
                    "name": Immutable.Map({
                      "path"  : "item.ABC.name",
                      "value" : "",
                      "meta"  : Immutable.Map({
                        "isTouched"    : false,
                        "theError"     : undefined,
                        "isFocused"    : false,
                        "initialValue" : "",
                        "isDirty"      : false,
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),
          newState =  formDataWithMutations.withMutations((inner) => FieldRegisterUpdaters.stateUpdater({
            ...options,
            formDataWithMutations: inner,
          }));

        expect(newState).toEqual(expectedState);
      });

      it("does not change the state, if it has this node", () => {
        const
          nodes: Nodes = getRealPath(getNodesFromString(idFieldName)),
          formDataWithMutations = Immutable.Map({
            "state": Immutable.Map({
              "items": Immutable.Map({
                "0": Immutable.Map({
                  "VALUES": Immutable.Map({
                    "name": Immutable.Map({
                      "path"  : "item.ABC.name",
                      "value" : "",
                      "meta"  : Immutable.Map({
                        "isTouched"    : false,
                        "theError"     : undefined,
                        "isFocused"    : false,
                        "initialValue" : "",
                        "isDirty"      : false,
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),

          options = {
            nodes,
            formDataWithMutations,
            idFieldName,
            indexFieldName,
          },
          newState =  formDataWithMutations.withMutations((inner) => FieldRegisterUpdaters.stateUpdater({
            ...options,
            formDataWithMutations: inner,
          }));

        expect(newState).toEqual(formDataWithMutations);
      });
    });
  });

  describe("managementUpdater", () => {
    describe("does not have in memory any references", () => {
      describe("for a single node", () => {
        it("it set a reference to 1", () => {
          const
            idFieldName: ID_FieldName = "testField" as ID_FieldName,
            indexFieldName: INDEX_FieldName = "testField" as INDEX_FieldName,
            nodes: Nodes = getRealPath(getNodesFromString(idFieldName)),
            formDataWithMutations = Immutable.Map({
              "state": Immutable.Map({
              }),
              "management": Immutable.Map({
              }),
            }),

            options = {
              nodes,
              formDataWithMutations,
              idFieldName,
              indexFieldName,
            },
            newState =  formDataWithMutations.withMutations((inner) => FieldRegisterUpdaters.managementUpdater({
              ...options,
              formDataWithMutations: inner,
            })),
            expectedState = Immutable.Map({
              "state": Immutable.Map({
              }),
              "management": Immutable.Map({
                "testField": Immutable.Map({
                  "REFERENCES": 1,
                }),
              }),
            });

          expect(newState).toEqual(expectedState);
        });
      });


      describe("for a list", () => {
        it("it set a reference to 1", () => {
          const
            idFieldName: ID_FieldName = "items.ID.name" as ID_FieldName,
            indexFieldName: INDEX_FieldName = "items.0.name" as INDEX_FieldName,
            nodes: Nodes = getRealPath(getNodesFromString(idFieldName)),
            formDataWithMutations = Immutable.Map({
              "state": Immutable.Map({
              }),
              "management": Immutable.Map({
              }),
            }),

            options = {
              nodes,
              formDataWithMutations,
              idFieldName,
              indexFieldName,
            },
            newState =  formDataWithMutations.withMutations((inner) => FieldRegisterUpdaters.managementUpdater({
              ...options,
              formDataWithMutations: inner,
            })),
            expectedState = Immutable.Map({
              "state": Immutable.Map({
              }),
              "management": Immutable.Map({
                "items": Immutable.Map({
                  "ID": Immutable.Map({
                    "VALUES": Immutable.Map({
                      "name": Immutable.Map({
                        "REFERENCES": 1,
                      }),
                    }),
                  }),
                }),
              }),
            });

          expect(newState).toEqual(expectedState);

        });
      });


    });

    describe("has in memory a reference", () => {
      describe("a field that is dirty", () => {
        describe("the field is not in the dirty list ", () => {
          it("it increases the references by 1 and the field is added to the list", () => {
            const 
              idFieldName: ID_FieldName = "items.ID.name" as ID_FieldName,
              indexFieldName: INDEX_FieldName = "items.0.name" as INDEX_FieldName,
              nodes: Nodes = getRealPath(getNodesFromString(idFieldName)),
              formDataWithMutations = Immutable.Map({
                "state": Immutable.Map({
                  "items": Immutable.List([
                    Immutable.Map({
                      "ID"     : "ID",
                      "VALUES" : Immutable.Map({
                        "name": Immutable.Map({
                          meta: Immutable.Map({
                            isDirty: true,
                          }),
                        }),
                      }),
                    }),
                  ]),
                }),
                "management": Immutable.Map({
                  "items": Immutable.Map({
                    "ID": Immutable.Map({
                      "VALUES": Immutable.Map({
                        "name": Immutable.Map({
                          "REFERENCES": 3,
                        }),
                      }),
                    }),
                  }),
                  "dirtyFields": Immutable.Set<string>(),
                }),
              }),
  
              options = {
                nodes,
                formDataWithMutations,
                idFieldName,
                indexFieldName,
              },
              newState =  formDataWithMutations.withMutations((inner) => FieldRegisterUpdaters.managementUpdater({
                ...options,
                formDataWithMutations: inner,
              })),
              newList = newState.getIn(["management", "dirtyFields"]) as Immutable.Set<string>,
              field = newState.getIn(["management", "items", "ID", "VALUES", "name"]) as Immutable.Set<string>;
  
            expect(field.get("REFERENCES")).toEqual(4);
            expect(newList.size).toEqual(1);
            expect(newList.first()).toEqual("items.ID.name");
          });
        });
        describe("the field is in the dirty list ", () => {
          it("it increases the references by 1 and keeps the list empty", () => {
            const 
              idFieldName: ID_FieldName = "items.ID.name" as ID_FieldName,
              indexFieldName: INDEX_FieldName = "items.0.name" as INDEX_FieldName,
              nodes: Nodes = getRealPath(getNodesFromString(idFieldName)),
              formDataWithMutations = Immutable.Map({
                "state": Immutable.Map({
                  "items": Immutable.List([
                    Immutable.Map({
                      "ID"     : "ID",
                      "VALUES" : Immutable.Map({
                        "name": Immutable.Map({
                          meta: Immutable.Map({
                            isDirty: true,
                          }),
                        }),
                      }),
                    }),
                  ]),
                }),
                "management": Immutable.Map({
                  "items": Immutable.Map({
                    "ID": Immutable.Map({
                      "VALUES": Immutable.Map({
                        "name": Immutable.Map({
                          "REFERENCES": 3,
                        }),
                      }),
                    }),
                  }),
                  "dirtyFields": Immutable.Set<string>(["items.ID.name"]),
                }),
              }),
  
              options = {
                nodes,
                formDataWithMutations,
                idFieldName,
                indexFieldName,
              },
              newState =  formDataWithMutations.withMutations((inner) => FieldRegisterUpdaters.managementUpdater({
                ...options,
                formDataWithMutations: inner,
              })),
              newList = newState.getIn(["management", "dirtyFields"]) as Immutable.Set<string>,
              field = newState.getIn(["management", "items", "ID", "VALUES", "name"]) as Immutable.Set<string>;
  
            expect(field.get("REFERENCES")).toEqual(4);
            expect(newList.size).toEqual(1);
            expect(newList.first()).toEqual("items.ID.name");
          });
        });         
      });
    });
  });
});

describe("handleRegisterField", () => {
  it("should register field correctly", () => {
    const formData: ImmutableFormState = Immutable.Map({
        state      : Immutable.Map(),
        management : Immutable.Map(),
      }),

      action: FieldEventRegisterFieldAction = {
        type    : "field-event-registerField",
        payload : {
          idFieldName    : "testField" as ID_FieldName,
          indexFieldName : "0" as INDEX_FieldName,
        },
      },

      updatedFormData = handleRegisterField(formData, action);

    expect(updatedFormData.getIn(["state", "testField"])).toEqual(Immutable.Map({ 
      "path"  : "testField",
      "value" : "",
      "meta"  : Immutable.Map ({
        "isTouched"    : false,
        "theError"     : undefined,
        "isFocused"    : false,
        "initialValue" : "",
        "isDirty"      : false,
      }),
    }));
    expect(updatedFormData.getIn(["management", "testField", REFERENCES_PATH])).toBe(1);
  });
});
