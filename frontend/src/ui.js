// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import {
  InputNode,
  LLMNode,
  OutputNode,
  TextNode,
  CalculatorNode,
  FilterNode,
  TransformerNode,
  ConditionalNode,
  JsonParserNode,
  CounterNode,
} from "./nodes/nodes";

import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  calculator: CalculatorNode,
  filter: FilterNode,
  transformer: TransformerNode,
  conditional: ConditionalNode,
  jsonParse: JsonParserNode,
  counter: CounterNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const getInitNodeData = useCallback((nodeID, type) => {
    return { id: nodeID, nodeType: `${type}` };
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (
        !event?.dataTransfer?.getData("application/reactflow") ||
        !reactFlowInstance
      ) {
        return;
      }

      try {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
        const type = appData?.nodeType;

        if (!type) return; // Get drop position in the viewport and convert to flow coordinates
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        // Create and add the new node
        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position: {
            x: Math.round(position.x / 20) * 20,
            y: Math.round(position.y / 20) * 20,
          },
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      } catch (error) {
        console.error("Error adding node:", error);
      }
    },
    [reactFlowInstance, getNodeID, addNode, getInitNodeData]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="absolute inset-0 bg-gray-950">
      <div ref={reactFlowWrapper} className="w-full h-full">
        <ReactFlow
          key={`${nodes.length}-${edges.length}`}
          fitView
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
          className="bg-gray-900"
        >
          <Background
            color="#374151"
            gap={gridSize}
            size={1.5}
            className="bg-gray-900"
          />
          <Controls className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl" />
          <MiniMap
            className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl"
            nodeColor={(node) => {
              switch (node.type) {
                case "customInput":
                  return "#60A5FA";
                case "llm":
                  return "#34D399";
                case "customOutput":
                  return "#F87171";
                default:
                  return "#6B7280";
              }
            }}
          />
        </ReactFlow>
      </div>
    </div>
  );
};
