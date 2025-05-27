export function ToolButton({ 
  icon, 
  onClick, 
  active = false, 
  tooltip, 
  className = "" 
}) {
  return (
    <button
      onClick={onClick}
      title={tooltip}
      className={`
        w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer
        ${active 
          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl' 
          : 'bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 hover:shadow-md'
        }
        ${className}
      `}
    >
      {icon}
    </button>
  );
}