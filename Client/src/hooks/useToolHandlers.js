import { useState } from "react";
import { TOOLS } from "../utils/constants";

export default function useToolHandlers() {
  const [tool, setTool] = useState(TOOLS.SELECT);

  const handleToolChange = (newTool) => {
    setTool(newTool);
  };

  return { tool, setTool, handleToolChange };
}
