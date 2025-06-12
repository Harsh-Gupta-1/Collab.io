import { Terminal as TerminalIcon } from "lucide-react";
export default function Terminal({ output }) {
  const safeOutput = output || "";

  return (
    <div className="h-full bg-gray-100 text-gray-800 flex flex-col font-mono">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-200 border-b border-gray-300">
        <div className="flex items-center gap-3">
          <TerminalIcon className="w-4 h-4 text-gray-600" />
          <span className="text-gray-700 font-medium text-sm">TERMINAL</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 p-4 overflow-auto font-mono text-sm">
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <span className="text-blue-500">$</span>
          <span>node app.js</span>
        </div>
        
        {safeOutput && (
          <div className="text-emerald-600 font-bold text-base leading-relaxed">
            {safeOutput.split("\n").map((line, i) => (
              <div key={i} className="mb-1">
                {line}
              </div>
            ))}
          </div>
        )}
        
        {/* Cursor */}
        <div className="flex items-center gap-2 text-gray-600 mt-2">
          <span className="text-blue-500">$</span>
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
}