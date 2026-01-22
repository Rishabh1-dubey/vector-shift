// baseNode.js
import { useState, useCallback, useMemo, useEffect } from "react";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { FieldRenderer } from "./FieldRendrer";

export const BaseNode = ({ id, data, config }) => {
  // Initialize state
  const [nodeState, setNodeState] = useState(() => {
    const initialState = {};
    config.fields?.forEach((field) => {
      const key = field.key;
      const defaultValue =
        data?.[key] !== undefined ? data[key] : field.defaultValue;
      initialState[key] = defaultValue;
    });
    return initialState;
  });

  // Handle field changes
  const handleFieldChange = (fieldKey, value) => {
    setNodeState((prev) => {
      const newState = { ...prev, [fieldKey]: value };

      // Call field-specific onChange if provided
      const field = config.fields?.find((f) => f.key === fieldKey);
      if (field?.onChange) {
        field.onChange(value, newState, setNodeState);
      }

      // Call global node onChange if provided
      if (config.onChange) {
        config.onChange(fieldKey, value, newState, setNodeState);
      }

      return newState;
    });
  };

  // Calculate handle positions with consistent spacing
  const calculateHandlePosition = (index, total) => {
    if (total === 1) return "50%";
    // Use a more predictable spacing that doesn't shift existing handles
    const spacing = 60 / Math.max(total - 1, 1); // 60% of the node height divided by gaps
    const startOffset = 20; // Start 20% from top
    return `${startOffset + index * spacing}%`;
  };

  // Default handle styles
  const defaultHandleStyle = {
    width: 12,
    height: 12,
    border: "3px solid rgb(31 41 55)",
    backgroundColor: "#60A5FA",
    borderRadius: "50%",
  };

  // Render handles
  const renderHandles = () => {
    const handles = [];

    // Input handles
    config.inputs?.forEach((input, index) => {
      handles.push(
        <Handle
          key={`input-${input.id}`}
          type="target"
          position={Position.Left}
          id={input.id} // Changed: Use just the input.id, not prefixed with node id
          style={{
            top: calculateHandlePosition(index, config.inputs.length),
            ...defaultHandleStyle,
            ...input.style,
          }}
        />
      );
    });

    // Output handles
    config.outputs?.forEach((output, index) => {
      handles.push(
        <Handle
          key={`output-${output.id}`}
          type="source"
          position={Position.Right}
          id={output.id} // Changed: Use just the output.id, not prefixed with node id
          style={{
            top: calculateHandlePosition(index, config.outputs.length),
            ...defaultHandleStyle,
            ...output.style,
          }}
        />
      );
    });

    return handles;
  };

  return (
    <div
      style={{ ...config.customStyles }}
      className={`flow-nodes min-w-[240px] min-h-[80px] w-[200px] rounded-lg p-3 border border-gray-700 bg-gray-800 text-white shadow-md font-inherit ${
        config.className || ""
      }`}
    >
      {renderHandles()}

      {/* Header */}
      {config.title && (
        <div className="font-bold text-xl pb-2 border-b border-gray-700 mb-3">
          {config.icon && <span className="mr-1">{config.icon}</span>}
          {config.title}
        </div>
      )}

      {/* Description */}
      {config.description && (
        <div className="text-sm text-gray-400 -mt-2 mb-3">
          {config.description}
        </div>
      )}

      {/* Fields */}
      {config.fields?.map((field) => (
        <div key={field.key} className="mb-3">
          {field.label && (
            <label className="text-sm text-gray-300 mb-1">{field.label}:</label>
          )}
          <FieldRenderer
            field={field}
            value={nodeState[field.key]}
            onChange={(value) => handleFieldChange(field.key, value)}
            nodeState={nodeState}
            setNodeState={setNodeState}
          />
        </div>
      ))}

      {/* Custom component after fields */}
      {config.afterFields &&
        config.afterFields({ nodeState, setNodeState, id })}
    </div>
  );
};

// Enhanced Text Node component that extends BaseNode functionality
export const EnhancedTextNode = ({ id, data, config }) => {
  const [dynamicInputs, setDynamicInputs] = useState([]);
  const [nodeSize, setNodeSize] = useState({
    width: config.width || 240,
    height: "auto",
  });

  // Import the hook to update node internals
  const updateNodeInternals = useUpdateNodeInternals();

  const extractVariables = useCallback((text) => {
    if (!text) return [];
    const variableRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const variables = new Set();
    let match;
    while ((match = variableRegex.exec(text)) !== null) {
      variables.add(match[1].trim());
    }
    return Array.from(variables);
  }, []);

  // Initialize dynamic inputs from initial data and handle updates
  useEffect(() => {
    if (data?.text) {
      const variables = extractVariables(data.text);
      // Sort variables to maintain consistent order
      const sortedVariables = variables.sort();
      const newInputs = sortedVariables.map((varName) => ({
        id: varName, // Just use the variable name as ID
        label: varName,
        style: {
          backgroundColor: "#60a5fa",
          border: "3px solid rgb(31 41 55)",
        },
      }));

      // Only update if inputs actually changed (compare sorted arrays)
      const currentIds = dynamicInputs.map((input) => input.id).sort();
      const newIds = sortedVariables;
      const inputsChanged =
        JSON.stringify(currentIds) !== JSON.stringify(newIds);

      if (inputsChanged) {
        setDynamicInputs(newInputs);
        // Force ReactFlow to update node internals after state change
        setTimeout(() => updateNodeInternals(id), 0);
      }
    } else if (dynamicInputs.length > 0) {
      setDynamicInputs([]);
      setTimeout(() => updateNodeInternals(id), 0);
    }
  }, [data?.text, extractVariables, id, updateNodeInternals, dynamicInputs]);

  // Handle text changes and update dynamic inputs
  const handleTextChange = useCallback(
    (value) => {
      if (data) {
        data.text = value;
        // Extract variables and update inputs
        const variables = extractVariables(value);
        // Sort variables to maintain consistent order
        const sortedVariables = variables.sort();
        const newInputs = sortedVariables.map((varName) => ({
          id: varName,
          label: varName,
          style: {
            backgroundColor: "#60a5fa",
            border: "3px solid rgb(31 41 55)",
          },
        }));

        const currentIds = dynamicInputs.map((input) => input.id).sort();
        const newIds = sortedVariables;
        const inputsChanged =
          JSON.stringify(currentIds) !== JSON.stringify(newIds);

        if (inputsChanged) {
          setDynamicInputs(newInputs);
          // Update ReactFlow internals after a short delay to ensure state is updated
          setTimeout(() => updateNodeInternals(id), 10);
        }
      }
    },
    [data, extractVariables, id, updateNodeInternals, dynamicInputs]
  );

  const handleResize = useCallback(
    (height) => {
      requestAnimationFrame(() => {
        const baseHeight = 32;
        const headerMargin = 12;
        const labelHeight = 20;
        const padding = 24;
        const variablesHeight = dynamicInputs.length ? 44 : 0;
        const margins = 16;

        const totalHeight =
          baseHeight +
          headerMargin +
          labelHeight +
          height +
          padding +
          variablesHeight +
          margins;

        setNodeSize((prev) => {
          const newHeight = Math.min(400, Math.max(140, totalHeight));
          if (prev.height !== newHeight) {
            return { ...prev, height: newHeight };
          }
          return prev;
        });
      });
    },
    [dynamicInputs.length]
  );

  const enhancedConfig = useMemo(
    () => ({
      ...config,
      // Combine static inputs with dynamic inputs
      inputs: [...(config.inputs || []), ...dynamicInputs],
      width: nodeSize.width,
      height: nodeSize.height,
      fields: config.fields?.map((field) => {
        if (field.key === "text") {
          return {
            ...field,
            onChange: handleTextChange,
            onResize: handleResize,
            inputStyle: {
              width: "100%",
              minHeight: "60px",
              maxHeight: "280px",
              resize: "none",
              overflow: "hidden",
              fontSize: "13px",
              lineHeight: "1.4",
              padding: "8px",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              ...field.inputStyle,
            },
          };
        }
        return field;
      }),
      afterFields: ({ nodeState }) => {
        if (dynamicInputs.length > 0) {
          return (
            <div
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                marginTop: "8px",
                padding: "4px 6px",
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: "4px",
                display: "flex",
                gap: "4px",
                flexWrap: "wrap",
              }}
            >
              {dynamicInputs.map((input) => (
                <span
                  key={input.id}
                  style={{
                    backgroundColor: "rgba(96,165,250,0.1)",
                    border: "1px solid rgba(96,165,250,0.2)",
                    padding: "1px 6px",
                    borderRadius: "4px",
                    fontSize: "10px",
                  }}
                >
                  {input.id}
                </span>
              ))}
            </div>
          );
        }
        return null;
      },
    }),
    [config, nodeSize, dynamicInputs, handleTextChange, handleResize]
  );

  return <BaseNode id={id} data={data} config={enhancedConfig} />;
};
