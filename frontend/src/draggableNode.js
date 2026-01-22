export const DraggableNode = ({ type, label, icon }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = "grabbing";
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData)
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
          {icon}
        </div>

        <div className="hidden group-hover:block absolute right-full top-1/2 -translate-y-1/2 mr-2 pointer-events-none z-[100]">
          <div className="bg-gray-600 text-white text-xs px-3 py-1.5 rounded-md shadow-xl whitespace-nowrap border border-gray-700/50 backdrop-blur-sm">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};
