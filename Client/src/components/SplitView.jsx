import Whiteboard from "./Whiteboard";
import CodeEditor from "./CodeEditor";
import Terminal from "./Terminal";
import ChatPanel from "./ChatPanel";

export default function SplitView({ roomId, codeSnippet, onCodeChange, output, onExecute, user, canvasStateRef }) {
  return (
    <div className="flex h-full">
      <div className="relative flex-1 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 h-full">
        <div className="absolute top-3 left-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-lg text-xs font-['Silkscreen']">
          WHITEBOARD
        </div>
        <div className="w-full h-full">
          <Whiteboard roomId={roomId} canvasStateRef={canvasStateRef} />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col border-l border-r border-gray-200/50">
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-gray-600 text-sm font-medium">app.js</span>
          </div>
          <button
            onClick={onExecute}
            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-lg cursor-pointer"
          >
            Run Code
          </button>
        </div>
        
        <div className="flex-1 bg-white">
          <CodeEditor 
            code={codeSnippet} 
            onChange={onCodeChange} 
            hideTerminal 
            hideHeader
            onExecute={onExecute} 
          />
        </div>
        
        <div className="h-40 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 border-t border-gray-300/50">
          <Terminal output={output || ""} />
        </div>
      </div>
      
      <ChatPanel roomId={roomId} id={roomId} user={user} />
    </div>
  );
}