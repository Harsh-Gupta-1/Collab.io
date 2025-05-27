import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getRoom } from "../api/roomAPI";
import { getSocket, disconnectSocket } from "../sockets/socket";
import Whiteboard from "../components/Whiteboard";
import CodeEditor from "../components/CodeEditor";
import SplitView from "../components/SplitView";
import ChatPanel from "../components/ChatPanel";
import Navbar from "../components/Navbar";
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

  const userName = location.state?.name || "Guest";

  useEffect(() => {
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
      toast.error("Execution failed", { autoClose: 4000 });
    }
  }, [codeSnippet]);

  const handleLeave = useCallback(() => {
    socketRef.current?.emit("leave-room", { roomId: id, username: userName });
    disconnectSocket();
    navigate("/");
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
    <div className="h-screen w-screen bg-white text-gray-800 font-inter">
      <Navbar
        roomId={id}
        roomName={roomName}
        userName={userName}
        isConnected={isConnected}
        mode={mode}
        onModeChange={handleModeChange}
        onLeave={handleLeave}
      />

      <div className="h-[calc(100vh-64px)]">
        {mode === "whiteboard" && (
          <div className="flex h-full">
            <div className="flex-1 w-full h-full">
              <Whiteboard
                roomId={id}
                socket={socketRef.current}
                canvasStateRef={canvasStateRef}
              />
            </div>
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
        )}

        {mode === "code" && (
          <div className="flex h-full">
            <div className="flex-1">
              <CodeEditor
                code={codeSnippet}
                onChange={handleCodeChange}
                onExecute={handleExecute}
                output={output}
                roomId={id}
              />
            </div>
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
        )}

        {mode === "split" && (
          <SplitView
            roomId={id}
            codeSnippet={codeSnippet}
            canvasStateRef={canvasStateRef}
            onCodeChange={handleCodeChange}
            onExecute={handleExecute}
            output={output}
            user={userName}
          />
        )}
      </div>

      <ToastContainer />
    </div>
  );
}