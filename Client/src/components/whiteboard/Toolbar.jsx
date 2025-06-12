import { useState } from "react";
import { 
  MousePointer2,  
  Type, 
  Move, 
  RotateCcw, 
  ZoomIn,
  ZoomOut,
  Maximize2,
  Settings
} from "lucide-react";

export default function Toolbar({ 
  tool, // Now receiving tool as prop
  setTool, 
  addShape, 
  addText, 
  deleteSelected, 
  undo, 
  clearCanvas, 
  resetZoom, 
  zoomIn, 
  zoomOut, 
  setColor, 
  setBrushSize, 
  zoom, 
  color, 
  brushSize 
}) {
  const [showShapes, setShowShapes] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Color palette
  const colors = [
   "#4f46e5", "#ff3b30", "#00d4aa", "#ff9500", 
   "#bf5af2", "#ff2d92", "#1d1d1f", "#34c759"
];

  // Handle tool change
  const handleToolChange = (newTool) => {
    setTool(newTool);
  };

  // Handle shape addition with automatic tool switching
  const handleShapeAdd = (shapeType) => {
    addShape(shapeType);
    setShowShapes(false); // Close the shapes dropdown
  };

  // Handle text addition with automatic tool switching
  const handleTextAdd = () => {
    addText();
  };

  return (
    <>
      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-4 left-4 z-30 bg-white/90 backdrop-blur-sm border border-indigo-200/50 rounded-2xl p-4 shadow-lg min-w-[200px]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Brush Size: {brushSize}px
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Color Palette
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                      color === c ? 'border-gray-800 shadow-md' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Indicator */}
      <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm border border-indigo-200/50 rounded-xl px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <button onClick={zoomOut} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <ZoomOut className="w-4 h-4 text-gray-600" />
          </button>
          <span className="text-sm font-semibold text-gray-700 min-w-[3rem] text-center">
            {zoom}%
          </span>
          <button onClick={zoomIn} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <ZoomIn className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Compact Toolbar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white/85 backdrop-blur-xl border border-indigo-200/50 rounded-3xl p-3 shadow-lg">
          <div className="flex items-center gap-3">
            {/* Select Tool */}
            <button
              onClick={() => handleToolChange('select')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                tool === 'select' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="Select"
            >
              <MousePointer2 className="w-4 h-4" />
            </button>

            {/* Pen Tool */}
            <button
              onClick={() => handleToolChange('pen')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                tool === 'pen' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="Pen"
            >
              ✏️
            </button>

            {/* Shapes Tool */}
            <div className="relative">
              <button
                onClick={() => setShowShapes(!showShapes)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all text-gray-600"
                title="Shapes"
              >
                ⬜
              </button>
              {showShapes && (
                <div className="absolute bottom-full mb-2 left-0 bg-white/90 backdrop-blur-sm border border-indigo-200/50 rounded-2xl shadow-lg p-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleShapeAdd('rect')} 
                      className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center text-lg"
                      title="Rectangle"
                    >
                      ⬜
                    </button>
                    <button 
                      onClick={() => handleShapeAdd('circle')} 
                      className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center text-lg"
                      title="Circle"
                    >
                      ⭕
                    </button>
                    <button 
                      onClick={() => handleShapeAdd('triangle')} 
                      className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center text-lg"
                      title="Triangle"
                    >
                      🔺
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Text Tool */}
            <button
              onClick={handleTextAdd}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all text-gray-600"
              title="Text (Auto-switches to select tool)"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Move Canvas Tool */}
            <button
              onClick={() => handleToolChange('move')}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                tool === 'move' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title="Move Canvas (Click and drag to pan)"
            >
              <Move className="w-4 h-4" />
            </button>

            {/* Separator */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Current Color Indicator */}
            <div
              className="w-10 h-10 rounded-xl border-2 border-white shadow-md cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => setShowSettings(!showSettings)}
              title="Current Color & Settings"
            />

            {/* Separator */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Reset Zoom */}
            <button
              onClick={resetZoom}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all text-gray-600"
              title="Reset Zoom (1:1)"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Delete Selected */}
            <button
              onClick={deleteSelected}
              className="w-10 h-10 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-xl flex items-center justify-center transition-all text-gray-600"
              title="Delete Selected"
            >
              🗑️
            </button>

            {/* Clear Canvas */}
            <button
              onClick={clearCanvas}
              className="w-10 h-10 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-xl flex items-center justify-center transition-all text-gray-600"
              title="Clear Canvas"
            >
              🧹
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showShapes || showSettings) && (
        <div 
          className="absolute inset-0 z-10" 
          onClick={() => {
            setShowShapes(false);
            setShowSettings(false);
          }}
        />
      )}

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #4f46e5, #7c3aed);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #4f46e5, #7c3aed);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
}