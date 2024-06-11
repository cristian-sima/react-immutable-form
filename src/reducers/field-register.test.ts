// FieldRegisterUpdaters.test.ts
import Immutable from "immutable";
import { describe, expect, it } from "vitest";
import { ID_FieldName, INDEX_FieldName, Nodes } from "../types";
import { getDefaultField, getNodesFromString, getRealPath } from "../util";
import { FieldRegisterUpdaters } from "./field-register";

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
    it("should update management state when node exists", () => {
      // const nodes: Nodes = Immutable.List(["existingNode"]),
      //   formDataWithMutations = Immutable.Map({
      //     state      : Immutable.Map().setIn(nodes, Immutable.Map()),
      //     management : Immutable.Map(),
      //   }),

      //   options = {
      //     nodes,
      //     formDataWithMutations,
      //     idFieldName,
      //     indexFieldName,
      //   };

      // FieldRegisterUpdaters.managementUpdater(options);

      // expect(formDataWithMutations.getIn(["management", ...nodes, REFERENCES_PATH])).toBe(1);
    });

    it("should set management state when node does not exist", () => {
      // const nodes: Nodes = Immutable.List(["newNode"]),
      //   formDataWithMutations = Immutable.Map({
      //     state      : Immutable.Map(),
      //     management : Immutable.Map(),
      //   }),

      //   options = {
      //     nodes,
      //     formDataWithMutations,
      //     idFieldName,
      //     indexFieldName,
      //   };

      // FieldRegisterUpdaters.managementUpdater(options);

      // expect(formDataWithMutations.getIn(["management", ...nodes, REFERENCES_PATH])).toBe(1);
    });
  });
});

describe("handleRegisterField", () => {
  it("should register field correctly", () => {
    // const formData: ImmutableFormState = Immutable.Map({
    //     state      : Immutable.Map(),
    //     management : Immutable.Map(),
    //   }),

    //   action: FieldEventRegisterFieldAction = {
    //     type    : "field-event-registerField",
    //     payload : {
    //       idFieldName    : "testField" as ID_FieldName,
    //       indexFieldName : "0" as INDEX_FieldName,
    //     },
    //   },

    //   updatedFormData = handleRegisterField(formData, action);

    // expect(updatedFormData.getIn(["state", "testField"])).toEqual(Immutable.Map({ idFieldName: "testField", value: "" }));
    // expect(updatedFormData.getIn(["management", "testField", REFERENCES_PATH])).toBe(1);
  });
});
