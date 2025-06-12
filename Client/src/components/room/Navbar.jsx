import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  Code, 
  Share2, 
  PenTool, 
  Monitor, 
  Layers, 
  LogOut,
  Copy,
  Check
} from "lucide-react";

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
  const [copied, setCopied] = useState(false);

  const handleCopyId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      toast.success("Room ID copied to clipboard!", { autoClose: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy Room ID", { autoClose: 2000 });
    }
  }, [roomId]);

  const modeConfig = {
    whiteboard: {
      icon: PenTool,
      label: "Draw"
    },
    code: {
      icon: Code,
      label: "Code"
    },
    split: {
      icon: Layers,
      label: "Both"
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-indigo-700/30 shadow-lg">
      <div className="px-6 py-3 flex justify-between items-center">
        {/* Left Section - Brand & Room Info */}
        <div className="flex items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30 backdrop-blur-sm">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">CollabSpace</span>
          </div>

          {/* Room Info */}
          <div className="flex items-center gap-3">
            <div className="bg-white/15 border border-white/25 px-4 py-2.5 rounded-xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-indigo-200">Room:</span>
                <span className="text-sm font-bold text-white">{roomName}</span>
              </div>
            </div>
            
            {/* Share Button */}
            <button
              onClick={handleCopyId}
              className="bg-white/15 hover:bg-white/25 text-white p-2.5 rounded-xl border border-white/25 hover:border-white/40 transform hover:-translate-y-0.5 transition-all duration-200 group backdrop-blur-md"
              title="Copy Room ID to share"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            {/* Connection Status */}
            <div className="flex items-center gap-2 bg-white/15 px-3 py-2.5 rounded-xl border border-white/25 backdrop-blur-md">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                }`}
              ></div>
              <span className="text-sm font-medium text-white">
                {isConnected ? "Live" : "Connecting..."}
              </span>
            </div>
          </div>
        </div>

        {/* Center Section - Separate Mode Capsules */}
        <div className="flex items-center gap-3">
          {Object.entries(modeConfig).map(([modeKey, config]) => {
            const Icon = config.icon;
            const isActive = mode === modeKey;
            return (
              <button
                key={modeKey}
                onClick={() => onModeChange(modeKey)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border backdrop-blur-md ${
                  isActive
                    ? 'bg-white text-gray-700 shadow-sm border-white/30'
                    : 'text-white/80 hover:text-white hover:bg-white/10 border-white/20 hover:border-white/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Section - User & Actions */}
        <div className="flex items-center gap-4">
          {/* User Profile */}
          <div className="flex items-center gap-2 bg-white/15 border border-white/25 px-3 py-2 rounded-xl backdrop-blur-md">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-white max-w-[100px] truncate">
              {userName}
            </span>
          </div>

          {/* Leave Button */}
          <button
            onClick={onLeave}
            className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 border border-red-400/30 hover:border-red-400/50 backdrop-blur-sm"
          >
            <LogOut className="w-4 h-4" />
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}