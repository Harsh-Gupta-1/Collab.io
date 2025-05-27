import { ToolButton } from "./ToolButton";

export function ZoomControls({ canvasRef, zoom, setZoom }) {
  const zoomIn = () => {
    const canvas = canvasRef.current;
    let newZoom = canvas.getZoom();
    newZoom = newZoom * 1.1;
    if (newZoom > 20) newZoom = 20;
    canvas.setZoom(newZoom);
    setZoom(newZoom);
  };

  const zoomOut = () => {
    const canvas = canvasRef.current;
    let newZoom = canvas.getZoom();
    newZoom = newZoom / 1.1;
    if (newZoom < 0.01) newZoom = 0.01;
    canvas.setZoom(newZoom);
    setZoom(newZoom);
  };

  const resetZoom = () => {
    const canvas = canvasRef.current;
    canvas.setZoom(1);
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    setZoom(1);
  };

  return (
    <div className="flex items-center gap-1">
      {/* <ToolButton
        icon={<span className="text-base">🔍➕</span>}
        onClick={zoomIn}
        tooltip="Zoom In"
      />
      <ToolButton
        icon={<span className="text-base">🔍➖</span>}
        onClick={zoomOut}
        tooltip="Zoom Out"
      /> */}
      <ToolButton
        icon={<span className="text-xs font-bold">1:1</span>}
        onClick={resetZoom}
        tooltip="Reset Zoom"
      />
    </div>
  );
}