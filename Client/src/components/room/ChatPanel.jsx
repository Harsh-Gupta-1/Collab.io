import { useState, useEffect, useRef } from "react";
import { getSocket } from "../../sockets/socket";
import { toast } from "react-toastify";

export default function ChatPanel({ roomId, user, style }) {
  const [input, setInput] = useState("");
  const [showParticipants, setShowParticipants] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(1);
  const [participants, setParticipants] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const participantsRef = useRef(null);
  const socketRef = useRef(null);
  const hasJoined = useRef(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (participantsRef.current && !participantsRef.current.contains(event.target)) {
        setShowParticipants(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      console.log("Chat socket connected:", socket.id);
      setIsConnected(true);
      if (!hasJoined.current) {
        const validUsername = user.trim() && !user.includes("CodeEditor") ? user : `Guest-${Math.random().toString(36).substr(2, 5)}`;
        socket.emit("join-room", { roomId, username: validUsername });
        setTimeout(() => {
          socket.emit("get-users", roomId);
          socket.emit("get-room-state", { roomId });
        }, 100);
        hasJoined.current = true;
      }
    };

    const handleDisconnect = () => {
      console.log("Chat socket disconnected");
      setIsConnected(false);
      hasJoined.current = false;
    };

    const handleReceiveMessage = (msg) => {
      console.log("Received message:", msg);
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    const handleRoomUsers = ({ users }) => {
      console.log("Room users updated:", users);
      setUserCount(users.length);
      setParticipants(users);
    };

    const handleUserJoined = ({ username }) => {
      console.log("User joined:", username);
      // toast.info(`${username} joined the room`, { autoClose: 3000 });
      setTimeout(() => socket.emit("get-users", roomId), 100);
    };

    const handleUserLeft = ({ username }) => {
      console.log("User left:", username);
      // toast.info(`${username} left the room`, { autoClose: 3000 });
      setTimeout(() => socket.emit("get-users", roomId), 100);
    };

    const handleRoomState = ({ messages }) => {
      console.log("Received chat room state:", messages);
      setMessages((prev) => {
        const newMessages = messages || [];
        const combined = [...prev, ...newMessages];
        return Array.from(new Map(combined.map((m) => [m.id, m])).values());
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("room-users", handleRoomUsers);
    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);
    socket.on("room-state", handleRoomState);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("room-users", handleRoomUsers);
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
      socket.off("room-state", handleRoomState);
    };
  }, [roomId, user]);

  const sendMessage = () => {
    if (!input.trim() || !isConnected || !socketRef.current) {
      // toast.error("Cannot send message: Not connected to server", { autoClose: 3000 });
      return;
    }

    const msg = {
      user,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text: input.trim(),
      id: Date.now() + Math.random(),
    };

    socketRef.current.emit("send-message", { roomId, msg });
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getAvatarColor = (username) => {
    const colors = [
      "from-indigo-400 to-purple-400",
      "from-purple-400 to-pink-400",
      "from-pink-400 to-rose-400",
      "from-blue-400 to-indigo-400",
      "from-emerald-400 to-teal-400",
      "from-orange-400 to-red-400",
    ];
    const hash = (username || "Guest").split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div 
      style={style} 
      className="w-[300px] h-full flex flex-col bg-gradient-to-b from-slate-50 to-white border-l border-gray-200/50 backdrop-blur-sm font-['Inter'] relative"
    >
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200/50 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm tracking-wide bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            TEAM CHAT
          </span>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-indigo-200/50 cursor-pointer hover:bg-white/80 transition-all duration-200"
              onClick={() => setShowParticipants(!showParticipants)}
            >
              <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}></div>
              <span className="text-xs font-medium text-gray-600">
                {userCount} online
              </span>
              <svg
                className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${showParticipants ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Dropdown */}
      {showParticipants && (
        <div
          ref={participantsRef}
          className="absolute top-16 right-4 z-50 bg-white rounded-xl shadow-xl border border-gray-200/50 backdrop-blur-xl min-w-[200px] max-w-[280px] overflow-hidden"
        >
          <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200/50">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Participants ({participants.length})
            </h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {participants.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                No participants found
              </div>
            ) : (
              participants.map((participant) => (
                <div
                  key={participant.id}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(participant.username)} flex items-center justify-center shadow-sm flex-shrink-0`}
                    >
                      <span className="text-white text-xs font-semibold">
                        {(participant.username || "Guest").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {participant.username === user
                          ? `${participant.username || "Guest"} (You)`
                          : participant.username || `Guest-${participant.id.slice(0, 5)}`}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-xs text-gray-500">online</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Messages Area - Takes up remaining space */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0 scrollbar-gutter-stable">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-end h-full pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-8 h-8 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              Start the conversation!
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Say hello to your teammates
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={msg.id || idx} className="flex items-start space-x-3 group">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(
                    msg.user
                  )} flex-shrink-0 flex items-center justify-center shadow-sm`}
                >
                  <span className="text-white text-xs font-semibold">
                    {(msg.user || "Guest").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-800 truncate">
                      {msg.user === user ? "You" : msg.user || "Guest"}
                    </span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                      {msg.time}
                    </span>
                  </div>
                  <div className="bg-white rounded-xl rounded-tl-md px-3 py-2 shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow duration-200">
                    <p className="text-sm text-gray-700 whitespace-pre-line break-words">
                      {msg.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-gray-200/50 bg-gradient-to-r from-white via-indigo-50/30 to-white backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={isConnected ? "Type your message..." : "Connecting to chat..."}
              className="w-full text-sm px-4 py-3 bg-white border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={!isConnected}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !isConnected}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:hover:scale-100 disabled:hover:shadow-md group cursor-pointer flex-shrink-0"
          >
            <svg
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>

        {/* Connection Status */}
        <div className="h-4 mt-2 flex items-center">
          <span className="text-[10px] text-gray-400 font-semibold">
            {!isConnected && "Connecting to chat..."}
          </span>
        </div>
      </div>
    </div>
  );
}