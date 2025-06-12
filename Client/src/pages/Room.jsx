// Room.jsx

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getRoom } from "../api/roomAPI";
import { getSocket, disconnectSocket } from "../sockets/socket";
import Whiteboard from "../components/whiteboard/Whiteboard";
import CodeEditor from "../components/room/CodeEditor";
import SplitView from "../components/room/SplitView";
import ChatPanel from "../components/room/ChatPanel";
import Navbar from "../components/room/Navbar";
import { executeCode } from "../api/executeAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Room() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const canvasStateRef = useRef(null);
  const [mode, setMode] = useState("whiteboard");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roomName, setRoomName] = useState("Untitled Room");
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(1);
  const [participants, setParticipants] = useState([]);
  const hasJoinedRoom = useRef(false);
  const socketRef = useRef(null);
  
const userName = location.state?.name;
    
  useEffect(() => {
    if (!userName) {
      navigate("/");
    }
    const fetchRoom = async () => {
      try {
        const room = await getRoom(id);
        setCodeSnippet(room.codeSnippet || "");
        setRoomName(room.name || "Untitled Room");
      } catch {
        setError("Failed to load room");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();

    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      setIsConnected(true);
      if (!hasJoinedRoom.current) {
        socket.emit("join-room", { roomId: id, username: userName });
        hasJoinedRoom.current = true;
        setTimeout(() => {
          socket.emit("get-users", id);
          socket.emit("get-room-state", { roomId: id });
        }, 100);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      hasJoinedRoom.current = false;
    };

    const handleCodeUpdate = (code) => setCodeSnippet(code);

    const handleReceiveMessage = (msg) => {
      setMessages((prev) =>
        prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
      );
    };

    const handleRoomUsers = ({ users }) => {
      setUserCount(users.length);
      setParticipants(users);
    };

    const handleRoomState = ({ messages, code, whiteboard }) => {
      if (code) setCodeSnippet(code);
      if (messages) {
        const combined = [...messages, ...messages];
        setMessages(
          Array.from(new Map(combined.map((m) => [m.id, m])).values())
        );
      }
      if (whiteboard) {
        canvasStateRef.current = JSON.stringify(whiteboard);
        if (mode === "whiteboard" || mode === "split") {
          window.dispatchEvent(new Event("canvasRestore"));
        }
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("code-update", handleCodeUpdate);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("room-users", handleRoomUsers);
    socket.on("room-state", handleRoomState);

    if (socket.connected) handleConnect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("code-update", handleCodeUpdate);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("room-users", handleRoomUsers);
      socket.off("room-state", handleRoomState);
    };
  }, [id, userName]);

  const handleCodeChange = useCallback(
    (code) => {
      setCodeSnippet(code);
      socketRef.current?.emit("code-update", { roomId: id, code });
    },
    [id]
  );

  const handleExecute = useCallback(async () => {
    try {
      const result = await executeCode(codeSnippet);
      setOutput(result.output || "Code executed successfully");
    } catch {
      setOutput("Error executing code");
      // toast.error("Execution failed", { autoClose: 4000 });
    }
  }, [codeSnippet]);

  const handleLeave = useCallback(() => {
    socketRef.current?.emit("leave-room", { roomId: id, username: userName });
    disconnectSocket();
    navigate("/dashboard");
  }, [id, userName, navigate]);

  const handleSendMessage = useCallback(
    (text) => {
      if (!text.trim()) return;
      const msg = {
        id: `${Date.now()}-${Math.random()}`,
        user: userName,
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      socketRef.current?.emit("send-message", { roomId: id, msg });
      setMessages((prev) => [...prev, msg]);
    },
    [id, userName]
  );

  const handleModeChange = (newMode) => {
    if (mode !== newMode) {
      setMode(newMode);
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
        if (newMode === "whiteboard" || newMode === "split") {
          socketRef.current?.emit("get-room-state", { roomId: id });
          window.dispatchEvent(new Event("canvasRestore"));
        }
      }, 150);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-mono">
        Loading room...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-500 font-mono">
        {error}
      </div>
    );

  return (
    <div className="h-screen w-screen bg-white text-gray-800 font-inter overflow-hidden">
      <Navbar
        roomId={id}
        roomName={roomName}
        userName={userName}
        isConnected={isConnected}
        mode={mode}
        onModeChange={handleModeChange}
        onLeave={handleLeave}
      />

      <div className="h-[calc(100vh-64px)] p-2 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {mode === "whiteboard" || mode === "code" ? (
          <div className="flex h-full overflow-hidden">
            <div className="flex-1 h-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg" />
              <div className="relative h-full bg-white rounded-lg shadow-sm border border-gray-200/50 overflow-hidden">
                {mode === "whiteboard" ? (
                  <Whiteboard
                    roomId={id}
                    socket={socketRef.current}
                    canvasStateRef={canvasStateRef}
                  />
                ) : (
                  <CodeEditor
                    code={codeSnippet}
                    onChange={handleCodeChange}
                    onExecute={handleExecute}
                    output={output}
                    roomId={id}
                  />
                )}
              </div>
            </div>
            <div className="w-[300px] h-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-lg" />
              <div className="relative h-full bg-white rounded-lg shadow-sm border border-gray-200/50 overflow-hidden flex flex-col">
                <ChatPanel
                  roomId={id}
                  user={userName}
                  onSendMessage={handleSendMessage}
                  messages={messages}
                  userCount={userCount}
                  participants={participants}
                  isConnected={isConnected}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full">
            <SplitView
              roomId={id}
              codeSnippet={codeSnippet}
              canvasStateRef={canvasStateRef}
              onCodeChange={handleCodeChange}
              onExecute={handleExecute}
              output={output}
              user={userName}
            />
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
