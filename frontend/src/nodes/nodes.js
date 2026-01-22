// nodes.js
import { createNode } from "../components/CreateNode";

// original default nodes.
const nodeConfigs = {
  input: {
    title: "Input",
    fields: [
      {
        key: "inputName",
        label: "Name",
        type: "text",
        defaultValue: "input_",
      },
      {
        key: "inputType",
        label: "Type",
        type: "select",
        defaultValue: "Text",
        options: [
          { value: "Text", label: "Text" },
          { value: "File", label: "File" },
        ],
      },
    ],
    outputs: [{ id: "value" }],
  },
  llm: {
    title: "LLM",
    description: "This is a LLM.",
    border: "1px solid rgb(55 65 81)",
    borderRadius: "8px",
    inputs: [{ id: "system" }, { id: "prompt" }],
    outputs: [{ id: "response" }],
  },
  output: {
    title: "Output",
    backgroundColor: "rgb(31 41 55)",
    border: "1px solid rgb(55 65 81)",
    borderRadius: "8px",
    fields: [
      {
        key: "outputName",
        label: "Name",
        type: "text",
        defaultValue: "output_",
      },
      {
        key: "outputType",
        label: "Type",
        type: "select",
        defaultValue: "Text",
        options: [
          { value: "Text", label: "Text" },
          { value: "Image", label: "Image" },
        ],
      },
    ],
    inputs: [{ id: "value" }],
  },
  text: {
    title: "Text",
    enhanced: true,
    backgroundColor: "rgb(31 41 55)",
    border: "1px solid rgb(55 65 81)",
    borderRadius: "8px",
    padding: "12px",
    minHeight: 140,
    fields: [
      {
        key: "text",
        label: "Content",
        type: "textarea",
        rows: 3,
        placeholder: "Enter text with variables like {{variableName}}",
        marginBottom: "8px",
        inputStyle: {
          backgroundColor: "rgb(17 24 39)",
          border: "1px solid rgb(55 65 81)",
          borderRadius: "4px",
          color: "rgb(209 213 219)",
          fontSize: "13px",
          lineHeight: "1.4",
          padding: "8px",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          minHeight: "60px",
        },
      },
    ],
    outputs: [{ id: "output" }],
  },
};

const extraNodesConfigs = {
  calculator: {
    title: "Calculator",
    icon: "🧮",
    width: 220,
    borderRadius: "8px",
    fields: [
      {
        key: "operation",
        label: "Operation",
        type: "select",
        defaultValue: "add",
        options: [
          { value: "add", label: "Add (+)" },
          { value: "subtract", label: "Subtract (-)" },
          { value: "multiply", label: "Multiply (×)" },
          { value: "divide", label: "Divide (÷)" },
        ],
      },
    ],
    inputs: [{ id: "operand1" }, { id: "operand2" }],
    outputs: [{ id: "result" }],
  },
  filter: {
    title: "Filter",
    icon: "🔍",
    borderRadius: "8px",
    fields: [
      {
        key: "condition",
        label: "Condition",
        type: "select",
        defaultValue: "contains",
        options: [
          { value: "contains", label: "Contains" },
          { value: "equals", label: "Equals" },
          { value: "greater_than", label: "Greater Than" },
          { value: "less_than", label: "Less Than" },
        ],
      },
      {
        key: "value",
        label: "Filter Value",
        type: "text",
        placeholder: "Enter filter value",
      },
      {
        key: "caseSensitive",
        label: "Case Sensitive",
        type: "checkbox",
        defaultValue: false,
      },
    ],
    inputs: [{ id: "data" }],
    outputs: [{ id: "filtered" }],
  },
  transformer: {
    title: "Data Transformer",
    icon: "🔄",
    width: 260,
    borderRadius: "8px",
    fields: [
      {
        key: "transformType",
        label: "Transform",
        type: "select",
        defaultValue: "uppercase",
        options: [
          { value: "uppercase", label: "To Uppercase" },
          { value: "lowercase", label: "To Lowercase" },
          { value: "trim", label: "Trim Whitespace" },
          { value: "reverse", label: "Reverse String" },
          { value: "length", label: "Get Length" },
          { value: "split", label: "Split by Delimiter" },
        ],
      },
      {
        key: "delimiter",
        label: "Delimiter (for split)",
        type: "text",
        defaultValue: ",",
        placeholder: "Enter delimiter",
      },
      {
        key: "preserveCase",
        label: "Preserve Original Case",
        type: "checkbox",
        defaultValue: false,
      },
    ],
    inputs: [{ id: "input" }],
    outputs: [{ id: "transformed" }],
  },
  conditional: {
    title: "Conditional",
    icon: "🔀",
    width: 280,
    borderRadius: "8px",
    fields: [
      {
        key: "condition",
        label: "Condition",
        type: "select",
        defaultValue: "if_true",
        options: [
          { value: "if_true", label: "If True" },
          { value: "if_false", label: "If False" },
          { value: "if_empty", label: "If Empty" },
          { value: "if_contains", label: "If Contains" },
          { value: "if_equals", label: "If Equals" },
        ],
      },
      {
        key: "comparisonValue",
        label: "Compare To",
        type: "text",
        placeholder: "Value to compare against",
      },
      {
        key: "defaultOutput",
        label: "Default Output",
        type: "text",
        defaultValue: "false",
      },
    ],
    inputs: [{ id: "condition" }, { id: "true_value" }, { id: "false_value" }],
    outputs: [{ id: "result" }],
  },
  jsonParser: {
    title: "JSON Parser",
    icon: "📋",
    width: 250,
    borderRadius: "8px",
    fields: [
      {
        key: "operation",
        label: "Operation",
        type: "select",
        defaultValue: "parse",
        options: [
          { value: "parse", label: "Parse JSON" },
          { value: "stringify", label: "Stringify to JSON" },
          { value: "extract", label: "Extract Key" },
        ],
      },
      {
        key: "keyPath",
        label: "Key Path",
        type: "text",
        placeholder: "e.g., user.name or items[0].title",
      },
      {
        key: "prettyPrint",
        label: "Pretty Print",
        type: "checkbox",
        defaultValue: true,
      },
    ],
    inputs: [{ id: "json_input" }],
    outputs: [{ id: "result" }],
  },
  counter: {
    title: "Counter",
    icon: "🔢",
    width: 220,
    borderRadius: "8px",
    fields: [
      {
        key: "operation",
        label: "Operation",
        type: "select",
        defaultValue: "increment",
        options: [
          { value: "increment", label: "Increment (+1)" },
          { value: "decrement", label: "Decrement (-1)" },
          { value: "add", label: "Add Value" },
          { value: "reset", label: "Reset to 0" },
          { value: "set", label: "Set Value" },
        ],
      },
      {
        key: "value",
        label: "Value",
        type: "number",
        defaultValue: 1,
        placeholder: "Amount to add/set",
      },
      {
        key: "initialValue",
        label: "Initial Value",
        type: "number",
        defaultValue: 0,
      },
    ],
    inputs: [{ id: "trigger" }, { id: "reset" }],
    outputs: [{ id: "count" }],
  },
};

export const InputNode = createNode(nodeConfigs.input);
export const LLMNode = createNode(nodeConfigs.llm);
export const OutputNode = createNode(nodeConfigs.output);
export const TextNode = createNode(nodeConfigs.text);
export const CalculatorNode = createNode(extraNodesConfigs.calculator);
export const FilterNode = createNode(extraNodesConfigs.filter);
export const TransformerNode = createNode(extraNodesConfigs.transformer);
export const ConditionalNode = createNode(extraNodesConfigs.conditional);
export const JsonParserNode = createNode(extraNodesConfigs.jsonParser);
export const CounterNode = createNode(extraNodesConfigs.counter);
