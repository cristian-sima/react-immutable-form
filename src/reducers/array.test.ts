import Immutable from "immutable";
import { describe, expect, it } from "vitest";
import { handleArrayAddAction, handleArrayRemoveAction } from "./array";
import { ArrayEventAdd, ArrayEventRemove } from "src/types-actions";
import { createRow } from "src/util";

describe("handleArrayAddAction", () => {
  it("should add a new row to the specified list in the state", () => {
    const formState = Immutable.Map({
        state: Immutable.Map({
          myList: Immutable.List<Immutable.Map<string, any>>(),
        }),
      }),
      action: ArrayEventAdd = {
        type    : "array-event-add",
        payload : { 
          ID       : "the-id",
          listName : "myList",
          data     : Immutable.Map({ name: "Test" }),
        },
      },
      newState = handleArrayAddAction(formState, action),
      expectedState = formState.updateIn(["state", "myList"], (list: any = Immutable.List()) => (
        list.push(
          createRow(action.payload.ID, action.payload.data, action.payload.listName),
        )
      ));
    
    expect(newState.toJS()).toEqual(expectedState.toJS());
  });

  it("should create a new list if it does not exist in the state", () => {
    const formState = Immutable.Map({
        state: Immutable.Map({}),
      }),
      action: ArrayEventAdd = {
        type    : "array-event-add",
        payload : { 
          ID       : "the-id",
          listName : "newList",
          data     : Immutable.Map({ name: "Test" }),
        },
      },
      newState = handleArrayAddAction(formState, action),
      expectedState = formState.updateIn(["state", "newList"], (list: any = Immutable.List()) => (
        list.push(
          createRow(action.payload.ID, action.payload.data, action.payload.listName),
        )
      ));
    
    expect(newState.toJS()).toEqual(expectedState.toJS());
  });

  it("should add to an existing list in the state", () => {
    const formState = Immutable.Map({
        state: Immutable.Map({
          myList: Immutable.List([
            createRow("other-item", Immutable.Map({ id: "1", name: "Existing" }), "myList"),
          ]),
        }),
      }),
      action: ArrayEventAdd = {
        type    : "array-event-add",
        payload : { 
          ID       : "the-id",
          listName : "myList",
          data     : Immutable.Map({ name: "New" }),
        },
      },
      newState = handleArrayAddAction(formState, action),
      expectedState = formState.updateIn(["state", "myList"], (list: any = Immutable.List()) => (
        list.push(
          createRow(action.payload.ID, action.payload.data, action.payload.listName),
        )
      ));
    
    expect(newState.toJS()).toEqual(expectedState.toJS());
  });
});

describe("handleArrayRemoveAction", () => {
  it("should remove the specified row from the list in the state", () => {
    const formState = Immutable.Map({
        state: Immutable.Map({
          myList: Immutable.List([
            createRow("1", Immutable.Map({ name: "Item 1" }), "myList"),
            createRow("2", Immutable.Map({ name: "Item 2" }), "myList"),
          ]),
        }),
      }),
      action: ArrayEventRemove = {
        type    : "array-event-remove",
        payload : { 
          ID       : "2",
          listName : "myList",
        },
      },
      newState = handleArrayRemoveAction(formState, action),
      expectedState = formState.updateIn(["state", "myList"], (list: any) => (
        list.delete(list.findIndex((current: any) => current.get("ID") === action.payload.ID))
      ));
    
    expect(newState.toJS()).toEqual(expectedState.toJS());
  });

  it("should not change the list if the specified ID does not exist", () => {
    const formState = Immutable.Map({
        state: Immutable.Map({
          myList: Immutable.List([
            createRow("1", Immutable.Map({ name: "Item 1" }), "myList"),
            createRow("2", Immutable.Map({ name: "Item 2" }), "myList"),
          ]),
        }),
      }),
      action: ArrayEventRemove = {
        type    : "array-event-remove",
        payload : { 
          ID       : "3",
          listName : "myList",
        },
      },
      newState = handleArrayRemoveAction(formState, action);
    
    expect(newState.toJS()).toEqual(formState.toJS());
  });

  it("should not change the state if the list does not exist", () => {
    const formState = Immutable.Map({
        state: Immutable.Map({}),
      }),
      action: ArrayEventRemove = {
        type    : "array-event-remove",
        payload : { 
          ID       : "1",
          listName : "nonExistentList",
        },
      },
      newState = handleArrayRemoveAction(formState, action);
    
    expect(newState.toJS()).toEqual(formState.toJS());
  });

  it("should handle empty initial state", () => {
    const formState = Immutable.Map({
        state: Immutable.Map({}),
      }),
      action: ArrayEventRemove = {
        type    : "array-event-remove",
        payload : { 
          ID       : "1",
          listName : "myList",
        },
      },
      newState = handleArrayRemoveAction(formState, action);
    
    expect(newState.toJS()).toEqual(formState.toJS());
  });

  it("should remove the only item in the list", () => {
    const formState = Immutable.Map({
        state: Immutable.Map({
          myList: Immutable.List([
            createRow("1", Immutable.Map({ name: "Item 1" }), "myList"),
          ]),
        }),
      }),
      action: ArrayEventRemove = {
        type    : "array-event-remove",
        payload : { 
          ID       : "1",
          listName : "myList",
        },
      },
      newState = handleArrayRemoveAction(formState, action),
      expectedState = formState.updateIn(["state", "myList"], (list: any) => (
        list.delete(list.findIndex((current: any) => current.get("ID") === action.payload.ID))
      ));
    
    expect(newState.toJS()).toEqual(expectedState.toJS());
  });
});

