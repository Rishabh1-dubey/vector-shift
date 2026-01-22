export const DraggableNode = ({ type, label, icon }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = "grabbing";
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData),
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="relative">
      <div
        className="group bg-gray-800 hover:bg-gray-700 rounded-md p-3 cursor-grab active:cursor-grabbing transition-colors duration-200 shadow-lg hover:shadow-xl"
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = "grab")}
        draggable
      >
        <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
          {label}
        </div>
      </div>
    </div>
  );
};
