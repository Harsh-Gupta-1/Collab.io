import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createRoom, getRoom } from "../api/roomAPI";

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [showRoomInput, setShowRoomInput] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [joinId, setJoinId] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setShowJoinInput(false);
    setJoinId(""); // Clear join room input
    setShowRoomInput(true);
  };

  const confirmCreate = async () => {
    if (!roomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }
    try {
      const room = await createRoom(roomName);
      navigate(`/room/${room._id}`, { state: { name, roomName } });
    } catch (err) {
      toast.error("Failed to create room");
    }
  };

  const handleJoin = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    setShowRoomInput(false);
    setRoomName(""); // Clear create room input
    setShowJoinInput(true);
  };

  const confirmJoin = async () => {
    if (!joinId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }
    try {
      const room = await getRoom(joinId);
      navigate(`/room/${joinId}`, { state: { name, roomName: room.name } });
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

  const resetInputs = () => {
    setShowRoomInput(false);
    setShowJoinInput(false);
    setRoomName("");
    setJoinId("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <ToastContainer 
        position="top-center" 
        toastClassName="backdrop-blur-sm bg-white/90 text-gray-800 border border-white/20"
      />
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-6xl">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            
            {/* Left Panel */}
            <div className="flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 text-white p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-50">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>
              
              <div className="relative z-10">
                <h1 className="text-5xl lg:text-6xl font-['Silkscreen'] leading-tight mb-8 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  CODE.<br />DRAW.<br />COLLABORATE.
                </h1>
                
                <div className="space-y-4 text-lg font-['Silkscreen'] text-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                    <p>Real-time team collaboration</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    <p>Persistent storage with MongoDB</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
                    <p>Write, draw, and work in one space</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-[480px] bg-white/95 backdrop-blur-sm p-12 lg:p-16 flex flex-col justify-center">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-['Silkscreen'] text-gray-800 mb-3">
                    Get Started
                  </h2>
                  <p className="text-gray-600 font-medium">Enter your details to begin collaborating</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-gray-800 px-4 py-4 rounded-xl transition-all duration-200 font-medium placeholder:text-gray-400"
                    />
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handleCreate}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-['Silkscreen'] py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm tracking-wide"
                    >
                      {showRoomInput ? "Creating Room..." : "Create Room"}
                    </button>

                    {/* Inline Room Name Input */}
                    {showRoomInput && (
                      <div className="flex items-center gap-3 transform transition-all duration-300 ease-out animate-in slide-in-from-top-3">
                        <input
                          type="text"
                          placeholder="Room name"
                          value={roomName}
                          onChange={(e) => setRoomName(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, 'create')}
                          className="flex-1 bg-indigo-50 border-2 border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-gray-800 px-4 py-3 rounded-xl transition-all duration-200 font-medium placeholder:text-indigo-400"
                          autoFocus
                        />
                        <button
                          onClick={confirmCreate}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 group"
                          title="Create Room"
                        >
                          <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                        <button
                          onClick={resetInputs}
                          className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                          title="Cancel"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-gray-500 font-medium">or</span>
                      </div>
                    </div>

                    <button
                      onClick={handleJoin}
                      className="w-full bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700 font-['Silkscreen'] py-4 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm tracking-wide"
                    >
                      {showJoinInput ? "Joining Room..." : "Join Room"}
                    </button>

                    {/* Inline Join Room Input */}
                    {showJoinInput && (
                      <div className="flex items-center gap-3 transform transition-all duration-300 ease-out animate-in slide-in-from-top-3">
                        <input
                          type="text"
                          placeholder="Room ID"
                          value={joinId}
                          onChange={(e) => setJoinId(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, 'join')}
                          className="flex-1 bg-emerald-50 border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 text-gray-800 px-4 py-3 rounded-xl transition-all duration-200 font-medium placeholder:text-emerald-400"
                          autoFocus
                        />
                        <button
                          onClick={confirmJoin}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 group"
                          title="Join Room"
                        >
                          <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                        <button
                          onClick={resetInputs}
                          className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                          title="Cancel"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}