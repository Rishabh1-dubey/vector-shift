import { BaseNode, EnhancedTextNode } from "./BaseNode";

// Enhanced BaseNode that supports dynamic inputs
export const createNode = (config) => {
  return ({ id, data }) => {
    // For enhanced text node, we need to modify the config dynamically
    if (config.enhanced) {
      return <EnhancedTextNode id={id} data={data} config={config} />;
    }
    return <BaseNode id={id} data={data} config={config} />;
  };
};
