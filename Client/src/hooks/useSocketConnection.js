import { useEffect, useRef } from "react";
import { getSocket } from "../sockets/socket";

export default function useSocketConnection(roomId, onReceiveData) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const handleUpdate = ({ data }) => {
      onReceiveData(data);
    };

    socket.on("whiteboard-update", handleUpdate);
    socket.emit("get-room-state", { roomId });

    return () => {
      socket.off("whiteboard-update", handleUpdate);
    };
  }, [roomId, onReceiveData]);

  const emitUpdate = (data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("whiteboard-update", { roomId, data });
    }
  };

  return { emitUpdate };
}
