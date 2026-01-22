import { DraggableNode } from "./draggableNode";

const COMPONENTS = [
  { type: "customInput", label: "Input" },
  { type: "llm", label: "LLM" },
  { type: "customOutput", label: "Output" },
  { type: "text", label: "Text" },
  { type: "calculator", label: "Calculator" },
  { type: "filter", label: "Filter" },
  { type: "transformer", label: "Transformer" },
  { type: "conditional", label: "Conditional" },
  { type: "jsonParse", label: "Json Parser" },
  { type: "counter", label: "Counter" },
];

export const PipelineToolbar = () => {
  return (
    <div className="bg-gray-900 py-3 px-4 border-b border-gray-800">
      <div className="flex items-center space-x-4 overflow-x-auto hide-scrollbar">
        <div className="flex-shrink-0 px-3 py-1 text-gray-400 text-sm font-medium">
          Components
        </div>
        <div className="flex items-center space-x-3">
          {COMPONENTS.map(({ type, label, icon: Icon }) => (
            <DraggableNode key={type} type={type} label={label} />
          ))}
        </div>
      </div>
    </div>
  );
};
