import React, { useCallback, useRef, useEffect, memo } from "react";

// AutoResizeTextarea component
const AutoResizeTextarea = memo(({ value, onChange, field }) => {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const height = textarea.scrollHeight;
    textarea.style.height = height + "px";

    if (field.onResize) {
      field.onResize(height);
    }
  }, [field]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  return (
    <textarea
      className="bg-gray-900 border border-gray-700 rounded text-white text-sm px-2 py-1 w-full outline-none"
      ref={textareaRef}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      rows={field.rows || 3}
      style={{
        minHeight: "60px",
        maxHeight: "300px",
        resize: "none",
        overflow: "hidden",
        ...field.inputStyle,
      }}
    />
  );
});

const Fields = {
  text: ({ value, onChange, field }) => (
    <input
      className="bg-gray-900 border border-gray-700 rounded text-white text-sm px-2 py-1 w-full outline-none"
      type="text"
      value={value || ""}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      placeholder={field.placeholder}
      style={{ ...field.inputStyle }}
    />
  ),

  textarea: (props) => <AutoResizeTextarea {...props} />, // Use AutoResizeTextarea component

  select: ({ value, onChange, field }) => (
    <select
      className="bg-gray-900 border border-gray-700 rounded text-white text-sm px-2 py-1 w-full outline-none"
      value={value || field.defaultValue}
      onChange={(e) => onChange(e.target.value)}
      style={{
        appearance: "none",
        paddingRight: "24px",
        ...field.inputStyle,
      }}
    >
      {field.options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),

  number: ({ value, onChange, field }) => (
    <input
      className="bg-gray-900 border border-gray-700 rounded text-white text-sm px-2 py-1 w-full outline-none"
      type="number"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      min={field.min}
      max={field.max}
      step={field.step}
      style={{ ...field.inputStyle }}
    />
  ),

  checkbox: ({ value, onChange, field }) => (
    <input
      type="checkbox"
      checked={value || false}
      onChange={(e) => onChange(e.target.checked)}
      style={field.inputStyle}
    />
  ),

  slider: ({ value, onChange, field }) => (
    <div>
      <input
        type="range"
        value={value || field.defaultValue || 0}
        onChange={(e) => onChange(Number(e.target.value))}
        min={field.min || 0}
        max={field.max || 100}
        step={field.step || 1}
        style={field.inputStyle}
      />
      <span style={{ fontSize: "12px", marginLeft: "8px" }}>
        {value || field.defaultValue || 0}
      </span>
    </div>
  ),

  color: ({ value, onChange, field }) => (
    <input
      type="color"
      value={value || field.defaultValue || "#000000"}
      onChange={(e) => onChange(e.target.value)}
      style={field.inputStyle}
    />
  ),
};

// Main field renderer
export const FieldRenderer = ({
  field,
  value,
  onChange,
  nodeState,
  setNodeState,
}) => {
  const FieldComponent = Fields[field.type];
  if (!FieldComponent) {
    console.warn(`Unknown field type: ${field.type}`);
    return null;
  }

  return <FieldComponent field={field} value={value} onChange={onChange} />;
};
