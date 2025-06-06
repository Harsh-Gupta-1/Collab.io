import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createRoom, getRoom } from "../api/roomAPI";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showRoomInput, setShowRoomInput] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [joinId, setJoinId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleCreate = () => {
    setShowJoinInput(false);
    setJoinId("");
    setShowRoomInput(!showRoomInput);
  };

  const confirmCreate = async () => {
    if (!roomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }
    try {
      const room = await createRoom(roomName);
      navigate(`/room/${room._id}`, { 
        state: { name: user.username, roomName } 
      });
    } catch (err) {
      toast.error("Failed to create room");
    }
  };

  const handleJoin = () => {
    setShowRoomInput(false);
    setRoomName("");
    setShowJoinInput(!showJoinInput);
  };

  const confirmJoin = async () => {
    if (!joinId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }
    try {
      const room = await getRoom(joinId);
      navigate(`/room/${joinId}`, { 
        state: { name: user.username, roomName: room.name } 
      });
    } catch (err) {
      toast.error("Invalid Room ID or room not found");
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      if (action === 'create') {
        confirmCreate();
      } else {
        confirmJoin();
      }
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <ToastContainer position="top-center" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {user.username}!
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Room Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Room Options</h2>
          
          <div className="space-y-4">
            {/* Create Room */}
            <div className="border rounded-lg p-4">
              <button
                onClick={handleCreate}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Create New Room
              </button>
              
              {showRoomInput && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'create')}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={confirmCreate}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Create
                  </button>
                </div>
              )}
            </div>

            {/* Join Room */}
            <div className="border rounded-lg p-4">
              <button
                onClick={handleJoin}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Join Existing Room
              </button>
              
              {showJoinInput && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter room ID"
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'join')}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    autoFocus
                  />
                  <button
                    onClick={confirmJoin}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Join
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}