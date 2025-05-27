import { ToolButton } from "./ToolButton";
import { TOOLS } from "../../utils/constants";

export function ToolControls({ tool, onToolChange }) {
  const handleToolClick = (selectedTool) => {
    if (tool === selectedTool) {
      onToolChange(TOOLS.NONE);
    } else {
      onToolChange(selectedTool);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <ToolButton
        icon={<span className="text-base">👆</span>}
        onClick={() => handleToolClick(TOOLS.SELECT)}
        active={tool === TOOLS.SELECT}
        tooltip="Select"
      />
      <ToolButton
        icon={<span className="text-base">✏️</span>}
        onClick={() => handleToolClick(TOOLS.PENCIL)}
        active={tool === TOOLS.PENCIL}
        tooltip="Pencil"
      />
      <ToolButton
        icon={<span className="text-base">⬜</span>}
        onClick={() => handleToolClick(TOOLS.RECTANGLE)}
        active={tool === TOOLS.RECTANGLE}
        tooltip="Rectangle"
      />
      {/* <ToolButton
        icon={<span className="text-base">📝</span>}
        onClick={() => handleToolClick(TOOLS.TEXT)}
        active={tool === TOOLS.TEXT}
        tooltip="Text"
      /> */}
      <ToolButton
        icon={<span className="text-base">👋</span>}
        onClick={() => handleToolClick(TOOLS.PAN)}
        active={tool === TOOLS.PAN}
        tooltip="Pan (drag to move around)"
      />
    </div>
  );
}