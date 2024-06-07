/* eslint-disable new-cap */

import Immutable from "immutable";
import { ID_FieldName, ImmutableFormState, ManagementState, Nodes } from "../types";
import { FieldEventUnregisterFieldAction } from "../types-actions";
import { REFERENCES_PATH, getNodesFromString, getRealPath } from "../util";

type hasInNodesOptions = {
  field: ID_FieldName;
  nodes: Nodes;
  management: ManagementState;
}

export class FieldUnRegisterUpdaters {
  static checkDirty = (field : ID_FieldName) => (givenState : Immutable.Map<string, any>) => {
    const performDirtyUpdate = (dirtyFields : Immutable.Set<string>) => (
      dirtyFields.delete(field)
    );
  
    return givenState.update("dirtyFields", performDirtyUpdate);
  };

  static handleNodeHasOneReference = (options : hasInNodesOptions) => {
    const 
      handleNodeHasOneReferenceAndItIsList = () => {
        const
          { field, nodes, management } = options,
          parentNodes = nodes.slice(0, -1),
          parentNode = management.getIn(parentNodes) as Immutable.Map<string, any>,
          hasParents = parentNode.size === 1,
          handleHasParents = () => (
            management.
              deleteIn(parentNodes.slice(0, -1)).
              withMutations(FieldUnRegisterUpdaters.checkDirty(field))
          ),
          handleNoParents = () => (
            management.
              deleteIn(nodes).
              withMutations(FieldUnRegisterUpdaters.checkDirty(field))
          );
    
        if (hasParents) {
          return handleHasParents();
        }
    
        return handleNoParents();
      },
      { field, nodes, management } = options,
      handleSingleNode = () => (
        management.
          deleteIn(nodes).
          withMutations(FieldUnRegisterUpdaters.checkDirty(field))
      );
      
    if (nodes.size === 1) {
      return handleSingleNode();
    }
        
    return handleNodeHasOneReferenceAndItIsList();
  };

  static managementHasNode = (options : hasInNodesOptions) => {
    const 
      { field, nodes, management } = options,
      path = [...nodes, REFERENCES_PATH],
      handleNodeHasMultipleReferences = () => (
        management.
          updateIn(path, (value: any) => value - 1).
          withMutations(FieldUnRegisterUpdaters.checkDirty(field))
      );

    if (management.getIn(path) === 1) {
      return FieldUnRegisterUpdaters.handleNodeHasOneReference(options);
    }

    return handleNodeHasMultipleReferences();
  };
}

export const 
  handleUnregisterField= (formData : ImmutableFormState, action : FieldEventUnregisterFieldAction) => {
    const 
      { field } = action.payload,
      getNewManagement = (management : ManagementState) => {
        const 
          nodes = getRealPath(getNodesFromString(field));
            
        if (management.hasIn(nodes)) {
          const options = {
            nodes,
            field,
            management,
          };
        
          return FieldUnRegisterUpdaters.managementHasNode(options);
        }
        return management;
      };

    return formData.update("management", getNewManagement);
  };