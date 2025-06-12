import { useRef, useState } from "react";
import useSocketLogic from "./SocketLogic";
import useCanvasInitialization from "./Canvas";
import Toolbar from "./Toolbar";

export default function EnhancedWhiteboard({ roomId = "demo", canvasStateRef }) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const isLoadingRef = useRef(false);
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);

  // State management - Default tool is now "pen"
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#4f46e5");
  const [brushSize, setBrushSize] = useState(3);
  const [zoom, setZoom] = useState(100);

  // Initialize canvas
  const {
    saveCanvasState,
    addShape,
    addText,
    deleteSelected,
    undo,
    clearCanvas,
    resetZoom,
    zoomIn,
    zoomOut
  } = useCanvasInitialization({
    canvasRef,
    fabricCanvasRef,
    isLoadingRef,
    undoStackRef,
    redoStackRef,
    canvasStateRef,
    tool,
    color,
    brushSize,
    setZoom
  });

  // Initialize socket logic
  useSocketLogic({ roomId, fabricCanvasRef, isLoadingRef, saveCanvasState });

  // Enhanced shape adding function that includes setTool
  const handleAddShape = (shapeType) => {
    addShape(shapeType, setTool);
  };

  // Enhanced text adding function that includes setTool
  const handleAddText = () => {
    addText(setTool);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20">
      {/* Canvas */}
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Toolbar */}
      <Toolbar
        tool={tool}
        setTool={setTool}
        addShape={handleAddShape}
        addText={handleAddText}
        deleteSelected={deleteSelected}
        undo={undo}
        clearCanvas={clearCanvas}
        resetZoom={resetZoom}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        setColor={setColor}
        setBrushSize={setBrushSize}
        zoom={zoom}
        color={color}
        brushSize={brushSize}
      />
    </div>
  );
}