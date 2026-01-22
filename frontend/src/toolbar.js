import { DraggableNode } from "./draggableNode";
import { FiCpu, FiType, FiHash, FiFilter, FiCode } from "react-icons/fi";
import { MdInput, MdOutlineOutput, MdOutlineTransform } from "react-icons/md";
import { ImCalculator } from "react-icons/im";
import { VscDebugPause } from "react-icons/vsc";

const COMPONENTS = [
  { type: "customInput", label: "Input", icon: MdInput },
  { type: "llm", label: "LLM", icon: FiCpu },
  { type: "customOutput", label: "Output", icon: MdOutlineOutput },
  { type: "text", label: "Text", icon: FiType },
  { type: "calculator", label: "Calculator", icon: ImCalculator },
  { type: "filter", label: "Filter", icon: FiFilter },
  { type: "transformer", label: "Transformer", icon: MdOutlineTransform },
  { type: "conditional", label: "Conditional", icon: VscDebugPause },
  { type: "jsonParse", label: "Json Parser", icon: FiCode },
  { type: "counter", label: "Counter", icon: FiHash },
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
            <DraggableNode
              key={type}
              type={type}
              label={label}
              icon={<Icon className="w-5 h-5 mb-1" />}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
