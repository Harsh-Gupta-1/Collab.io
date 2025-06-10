import Whiteboard from "../whiteboard/Whiteboard";
import CodeEditor from "./CodeEditor";
import Terminal from "./Terminal";
import ChatPanel from "./ChatPanel";

export default function SplitView({ roomId, codeSnippet, onCodeChange, output, onExecute, user, canvasStateRef }) {
  return (
    <div className="h-full bg-indigo-50/60 backdrop-blur-xl border border-indigo-200/50 rounded-3xl overflow-hidden">
      <div className="flex h-full">
        {/* Left: Whiteboard */}
        <div className="flex-1 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20 relative border-r border-indigo-200/50">
          <div className="absolute top-3 left-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-lg text-xs font-['Silkscreen']">
            WHITEBOARD
          </div>
          <div className="w-full h-full">
            <Whiteboard roomId={roomId} canvasStateRef={canvasStateRef} />
          </div>
        </div>
        
        {/* Separator */}
        <div className="w-px bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent"></div>
        
        {/* Middle: Code Editor */}
        <div className="flex-1 flex flex-col border-r border-indigo-200/50">
          <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-gray-700 font-medium text-sm">app.js</span>
          </div>

          <button
            onClick={onExecute}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-md cursor-pointer"
          >
            Run Code
          </button>
        </div>
          
          <div className="flex-[0.8] bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/20">
            <CodeEditor 
              code={codeSnippet} 
              onChange={onCodeChange} 
              hideTerminal 
              hideHeader
              onExecute={onExecute} 
            />
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
          
          <div className="h-48 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 border-t border-gray-300/50">
            <Terminal output={output || ""} />
          </div>
        </div>
        
        {/* Separator */}
        <div className="w-px bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent"></div>
        
        {/* Right: Chat */}
        <div className="w-72 bg-gradient-to-b from-indigo-50 to-white">
          <ChatPanel roomId={roomId} user={user} />
        </div>
      </div>
    </div>
  );
}