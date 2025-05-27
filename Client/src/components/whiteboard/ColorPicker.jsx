import { useState, useEffect } from "react";
import { COLORS } from "../../utils/constants"

export function ColorPicker({ color, onColorChange }) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showColorPicker && !event.target.closest(".color-picker-container")) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showColorPicker]);

  return (
    <div className="relative color-picker-container">
      <div
        onClick={() => setShowColorPicker(!showColorPicker)}
        className="w-9 h-9 rounded-full border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors shadow-sm"
        style={{ backgroundColor: color }}
        title="Color"
      ></div>

      {showColorPicker && (
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 grid grid-cols-3 gap-1 w-24 z-30">
          {COLORS.map((c) => (
            <div
              key={c}
              onClick={() => {
                onColorChange(c);
                setShowColorPicker(false);
              }}
              className={`w-5 h-5 rounded-full cursor-pointer border-2 hover:scale-110 transition-transform shadow-sm ${
                color === c
                  ? "border-blue-500 ring-1 ring-blue-200"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      )}
    </div>
  );
}