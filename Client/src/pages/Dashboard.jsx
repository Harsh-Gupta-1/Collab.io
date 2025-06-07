import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createRoom, getRoom, getUserRooms } from "../api/roomAPI";
import { 
  Code, 
  Home, 
  Users, 
  History, 
  Settings, 
  Plus, 
  Search,
  LogOut,
  Calendar,
  Clock,
  X,
  Hash
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRooms, setUserRooms] = useState([]);
  const [activeTab, setActiveTab] = useState("rooms");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [joinId, setJoinId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchUserRooms();
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  }, [navigate]);

  const fetchUserRooms = async () => {
    try {
      const rooms = await getUserRooms();
      setUserRooms(rooms);
    } catch (error) {
      toast.error("Failed to fetch your rooms");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const confirmCreate = async () => {
    if (!roomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }
    setLoading(true);
    try {
      const room = await createRoom(roomName);
      setUserRooms([...userRooms, { _id: room._id, name: room.name, createdAt: room.createdAt }]);
      setShowCreateModal(false);
      setRoomName("");
      navigate(`/room/${room._id}`, {
        state: { name: user.username, roomName },
      });
    } catch (err) {
      toast.error("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const confirmJoin = async () => {
    if (!joinId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }
    setLoading(true);
    try {
      const room = await getRoom(joinId);
      if (!userRooms.some((r) => r._id === room._id)) {
        setUserRooms([...userRooms, { _id: room._id, name: room.name, createdAt: room.createdAt }]);
      }
      setShowJoinModal(false);
      setJoinId("");
      navigate(`/room/${joinId}`, {
        state: { name: user.username, roomName: room.name },
      });
    } catch (err) {
      toast.error("Invalid Room ID or room not found");
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (roomId, roomName) => {
    navigate(`/room/${roomId}`, {
      state: { name: user.username, roomName },
    });
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowJoinModal(false);
    setRoomName("");
    setJoinId("");
  };

  const filteredRooms = userRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarItems = [
    { id: "rooms", label: "Rooms", icon: Home },
    { id: "mywork", label: "My Work", icon: Code },
    { id: "shared", label: "Shared", icon: Users },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `Updated ${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `Updated ${Math.floor(diffInMinutes / 60)} hr ago`;
    return `Updated ${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getRoomColor = (index) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-purple-500 to-purple-600", 
      "from-orange-500 to-orange-600",
      "from-green-500 to-green-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600"
    ];
    return colors[index % colors.length];
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ToastContainer 
        position="top-center" 
        toastClassName="bg-white text-gray-800 border border-gray-200 shadow-lg"
      />

      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-800">COLLAB.IO</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    isActive 
                      ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-600' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-gray-900 font-medium text-sm">{user.username}</p>
              <p className="text-gray-500 text-xs truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h1 className="text-3xl text-gray-800 mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600">Welcome back, {user.username}! Ready to collaborate?</p>
              
              {/* Quick Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Room
                </button>
                
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 font-medium py-3 px-6 rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                >
                  <Hash className="w-4 h-4" />
                  Join Room
                </button>
              </div>
            </div>
          </div>

          {/* Recent Rooms */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-gray-800">Recent Rooms</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-10 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>
            </div>

            {filteredRooms.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg mb-2">No rooms found</p>
                <p className="text-gray-400 text-sm mb-4">
                  {searchQuery ? "Try adjusting your search" : "Create your first room to get started"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Create Your First Room
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room, index) => (
                  <div
                    key={room._id}
                    onClick={() => handleRoomClick(room._id, room.name)}
                    className="group cursor-pointer"
                  >
                    <div className={`bg-gradient-to-br ${getRoomColor(index)} rounded-xl p-6 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-white font-bold text-lg truncate flex-1">
                            {room.name}
                          </h3>
                          <div className="w-2 h-2 bg-green-400 rounded-full ml-2 flex-shrink-0"></div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-white/90 text-sm mb-3">
                          <Clock className="w-4 h-4" />
                          <span>{getTimeAgo(room.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-white/80 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>Created {new Date(room.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl text-gray-800">Create New Room</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Room Name</label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && confirmCreate()}
                    placeholder="Enter a creative room name..."
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 text-gray-800 px-4 py-3 rounded-xl transition-all duration-200 font-medium"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={closeModals}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmCreate}
                    disabled={loading || !roomName.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200"
                  >
                    {loading ? 'Creating...' : 'Create Room'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl text-gray-800">Join Existing Room</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Room ID</label>
                  <input
                    type="text"
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && confirmJoin()}
                    placeholder="Paste the room ID here..."
                    className="w-full bg-gray-50 border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 text-gray-800 px-4 py-3 rounded-xl transition-all duration-200 font-medium"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ask your teammate for the room ID to join their session
                  </p>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={closeModals}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmJoin}
                    disabled={loading || !joinId.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200"
                  >
                    {loading ? 'Joining...' : 'Join Room'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}