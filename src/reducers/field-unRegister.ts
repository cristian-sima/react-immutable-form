/* eslint-disable new-cap */

import Immutable from "immutable";
import { ID_FieldName, ImmutableFormState, ManagementState, Nodes } from "../types";
import { FieldEventUnregisterFieldAction } from "../types-actions";
import { REFERENCES_PATH, getNodesFromString, getRealPath } from "../util";

/** @intern */
type hasInNodesOptions = {
  idFieldName: ID_FieldName;
  nodes: Nodes;
  management: ManagementState;
}

/** @intern */
export class FieldUnRegisterUpdaters {
  static checkDirty = (idFieldName : ID_FieldName) => (givenState : Immutable.Map<string, any>) => {
    const performDirtyUpdate = (dirtyFields : Immutable.Set<string>) => (
      dirtyFields.delete(idFieldName)
    );
  
    return givenState.update("dirtyFields", performDirtyUpdate);
  };

  /**
   * Handles a node that has one reference within an immutable data structure.
   *
   * This function manages the deletion of nodes from an immutable data structure
   * based on the provided options. It distinguishes between handling a single node
   * and a list of nodes, performing the appropriate operations to maintain the 
   * integrity of the data structure.
   *
   * @param options - An object containing the following properties:
   *   @property idFieldName - The name of the ID field to be managed.
   *   @property nodes - An array of nodes representing the path in the data structure.
   *   @property management - An object that provides methods to manipulate the data structure,
   *                          specifically supporting the `deleteIn` and `withMutations` methods.
   * 
   * @returns The updated management object after processing the nodes.
   */
  static handleNodeHasOneReference = (options : hasInNodesOptions) => {
    const 
      handleNodeHasOneReferenceAndItIsList = () => {
        const
          { idFieldName, nodes, management } = options,
          parentNodes = nodes.slice(0, -1),
          parentNode = management.getIn(parentNodes) as Immutable.Map<string, any>,
          theRowHasOnlyThisField = parentNode.size === 1,
          handleRowHasOnlyThisField = () => (
            management.
              deleteIn(parentNodes.slice(0, -1)).
              withMutations(FieldUnRegisterUpdaters.checkDirty(idFieldName))
          ),
          handleRowHasMultipleFields = () => (
            management.
              deleteIn(nodes).
              withMutations(FieldUnRegisterUpdaters.checkDirty(idFieldName))
          );
    
        if (theRowHasOnlyThisField) {
          return handleRowHasOnlyThisField();
        }
    
        return handleRowHasMultipleFields();
      },
      { idFieldName, nodes, management } = options,
      handleSingleNode = () => (
        management.
          deleteIn(nodes).
          withMutations(FieldUnRegisterUpdaters.checkDirty(idFieldName))
      );
      
    if (nodes.size === 1) {
      return handleSingleNode();
    }
        
    return handleNodeHasOneReferenceAndItIsList();
  };

  static managementHasNode = (options : hasInNodesOptions) => {
    const 
      { idFieldName, nodes, management } = options,
      path = [...nodes, REFERENCES_PATH],
      handleNodeHasMultipleReferences = () => (
        management.
          updateIn(path, (value: any) => value - 1).
          withMutations(FieldUnRegisterUpdaters.checkDirty(idFieldName))
      );

    if (management.getIn(path) === 1) {
      return FieldUnRegisterUpdaters.handleNodeHasOneReference(options);
    }

    return handleNodeHasMultipleReferences();
  };
}

/** @intern */
export const 
  handleUnregisterField= (formData : ImmutableFormState, action : FieldEventUnregisterFieldAction) => {
    const 
      { idFieldName } = action.payload,
      getNewManagement = (management : ManagementState) => {
        const 
          nodes = getRealPath(getNodesFromString(idFieldName));
            
        if (management.hasIn(nodes)) {
          const options = {
            nodes,
            idFieldName,
            management,
          };
        
          return FieldUnRegisterUpdaters.managementHasNode(options);
        }

        return management;
      };

    return formData.update("management", getNewManagement);
  };