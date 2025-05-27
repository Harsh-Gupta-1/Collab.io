import { ToolControls } from "./ToolControls";
import { ColorPicker } from "./ColorPicker";
import { ZoomControls } from "./ZoomControls";
import { ActionControls } from "./ActionControls";

export function Toolbar({ 
  tool, 
  onToolChange, 
  color, 
  onColorChange, 
  canvasRef, 
  zoom, 
  setZoom, 
  onSync 
}) {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/85 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-3 flex items-center gap-3 z-20" 
         style={{
           boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3)'
         }}>
      <ToolControls tool={tool} onToolChange={onToolChange} />
      
      <div className="w-px h-8 bg-gray-300/60"></div>
      
      <ColorPicker color={color} onColorChange={onColorChange} />
      
      <div className="w-px h-8 bg-gray-300/60"></div>
      
      <ZoomControls canvasRef={canvasRef} zoom={zoom} setZoom={setZoom} />
      
      <div className="w-px h-8 bg-gray-300/60"></div>
      
      <ActionControls canvasRef={canvasRef} onSync={onSync} />
    </div>
  );
}