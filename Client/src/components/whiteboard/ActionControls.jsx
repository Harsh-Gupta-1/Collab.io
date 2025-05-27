import { ToolButton } from "./ToolButton";

export function ActionControls({ canvasRef, onSync }) {
  const undo = () => {
    const canvas = canvasRef.current;
    const objs = canvas.getObjects();
    if (objs.length > 0) {
      canvas.remove(objs[objs.length - 1]);
      canvas.renderAll();
      onSync();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    canvas.renderAll();
    onSync();
  };

  const deleteSelected = () => {
    const canvas = canvasRef.current;
    const activeObject = canvas.getActiveObject();
    
    if (activeObject) {
      if (activeObject.type === 'activeSelection') {
        activeObject.forEachObject((obj) => {
          canvas.remove(obj);
        });
        canvas.discardActiveObject();
      } else {
        canvas.remove(activeObject);
      }
      canvas.renderAll();
      onSync();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <ToolButton
        icon={<span className="text-base">↶</span>}
        onClick={undo}
        tooltip="Undo"
      />
      <ToolButton
        icon={<span className="text-base">🗑️</span>}
        onClick={deleteSelected}
        tooltip="Delete"
        className="hover:bg-orange-50"
      />
      <ToolButton
        icon={<span className="text-base">🧹</span>}
        onClick={clearCanvas}
        tooltip="Clear"
        className="hover:bg-red-50"
      />
    </div>
  );
}