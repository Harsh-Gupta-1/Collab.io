import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Navbar({
  roomId,
  roomName,
  userName,
  isConnected,
  mode,
  onModeChange,
  onLeave
}) {
  const navigate = useNavigate();

  const handleCopyId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard!", { autoClose: 3000 });
    } catch (err) {
      toast.error("Failed to copy Room ID", { autoClose: 3000 });
    }
  }, [roomId]);

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-indigo-700/30 shadow-lg">
      <div className="px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="font-['Silkscreen'] text-xl text-white">
            COLLAB.IO
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
            <span className="text-sm font-['Silkscreen'] text-blue-100">
              ROOM:
            </span>
            <span className="text-sm font-mono text-white">{roomName}</span>
            <button
              onClick={handleCopyId}
              className="ml-1 p-1 hover:bg-white/20 rounded-md transition-all duration-200 group cursor-pointer"
              title="Copy Room ID"
            >
              <svg
                className="w-3 h-3 text-indigo-200 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400"
              }`}
            ></div>
            <span className="text-sm text-white">
              {isConnected ? "Connected" : "Connecting..."}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onModeChange("whiteboard")}
            className={`px-3 py-1.5 rounded-xl font-['Silkscreen'] text-sm text-white transition-all cursor-pointer ${
              mode === "whiteboard"
                ? "bg-white/20 border border-white/30"
                : "bg-white/10 border border-white/20 hover:bg-white/15"
            }`}
          >
            WHITEBOARD
          </button>
          <button
            onClick={() => onModeChange("code")}
            className={`px-3 py-1.5 rounded-xl font-['Silkscreen'] text-sm text-white transition-all cursor-pointer ${
              mode === "code"
                ? "bg-white/20 border border-white/30"
                : "bg-white/10 border border-white/20 hover:bg-white/15"
            }`}
          >
            CODE EDITOR
          </button>
          <button
            onClick={() => onModeChange("split")}
            className={`px-3 py-1.5 rounded-xl font-['Silkscreen'] text-sm text-white transition-all cursor-pointer ${
              mode === "split"
                ? "bg-white/20 border border-white/30"
                : "bg-white/10 border border-white/20 hover:bg-white/15"
            }`}
          >
            SPLIT VIEW
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-2 rounded-lg border border-white/20">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 rounded-full flex items-center justify-center ring-2 ring-white/20">
              <span className="text-white text-xs font-bold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-white font-medium truncate max-w-[100px]">
              {userName}
            </span>
          </div>
          <button
            onClick={onLeave}
            className="bg-gradient-to-r from-red-500/90 to-rose-500/90 hover:from-red-500 hover:to-rose-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 border border-red-400/40 shadow-lg cursor-pointer"
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}