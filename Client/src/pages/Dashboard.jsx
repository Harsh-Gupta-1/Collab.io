import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createRoom, getRoom, getUserRooms } from "../api/roomAPI";
import { 
  Code2, 
  Users, 
  Plus, 
  Search,
  LogOut,
  X,
  Hash,
  Filter,
  Sparkles,
  FolderOpen,
  ArrowRight,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRooms, setUserRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [joinId, setJoinId] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 9;

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

  const handleRoomJoin = (roomId, roomName) => {
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

  const getFilteredAndSortedRooms = () => {
    let filtered = userRooms.filter(room =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterType === "starred") {
      filtered = filtered.filter(room => room.isStarred);
    } else if (filterType === "archived") {
      filtered = filtered.filter(room => room.isArchived);
    } else if (filterType === "active") {
      filtered = filtered.filter(room => !room.isArchived);
    }

    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return filtered;
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStats = () => {
    const totalRooms = userRooms.length;
    const recentRooms = userRooms.filter(room => {
      const daysDiff = Math.floor((new Date() - new Date(room.createdAt)) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    }).length;
    
    return { totalRooms, recentRooms };
  };

  const getMostRecentRoomTime = () => {
    if (userRooms.length === 0) return "None";
    const mostRecentRoom = userRooms.reduce((latest, room) => {
      return !latest || new Date(room.createdAt) > new Date(latest.createdAt) ? room : latest;
    }, null);
    return getTimeAgo(mostRecentRoom.createdAt);
  };

  const stats = getStats();
  const filteredRooms = getFilteredAndSortedRooms();
  
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
  const startIndex = (currentPage - 1) * roomsPerPage;
  const endIndex = startIndex + roomsPerPage;
  const currentRooms = filteredRooms.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, sortBy]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="text-purple-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <ToastContainer 
        position="top-center" 
        toastClassName="bg-white text-gray-800 border border-gray-200 shadow-lg"
      />

      <header className="bg-white/90 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CollabSpace</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-gray-900 font-medium text-sm">{user.username}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="bg-white/80 rounded-2xl border border-purple-200 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Welcome back, {user.username}!
                </h1>
                <p className="text-gray-600">Ready to collaborate on your next project?</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Room
                </button>
                
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="bg-white border border-purple-300 text-purple-700 hover:bg-purple-50 font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Hash className="w-4 h-4" />
                  Join Room
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 rounded-xl border border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
              </div>
              <FolderOpen className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white/80 rounded-xl border border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentRooms}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white/80 rounded-xl border border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                <p className="text-2xl font-bold text-gray-900">{getMostRecentRoomTime()}</p>
              </div>
              <Clock className="w-8 h-8 text-indigo-500" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 rounded-2xl border border-purple-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-purple-600" />
              Your Rooms ({filteredRooms.length})
            </h2>
            
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-purple-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>

              {/* <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-white border border-purple-300 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 transition-colors flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-purple-300 rounded-lg shadow-xl z-10 overflow-hidden">
                    <div className="p-2">
                      <button
                        onClick={() => { setFilterType("all"); setShowFilters(false); }}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${filterType === "all" ? "bg-purple-100 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        All Rooms
                      </button>
                      <button
                        onClick={() => { setFilterType("active"); setShowFilters(false); }}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${filterType === "active" ? "bg-purple-100 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => { setFilterType("archived"); setShowFilters(false); }}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${filterType === "archived" ? "bg-purple-100 text-purple-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        Archived
                      </button>
                    </div>
                  </div>
                )}
              </div> */}

              {/* <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-purple-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="recent">Recent</option>
                <option value="name">Name</option>
                <option value="oldest">Oldest</option>
              </select> */}
            </div>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? "Try adjusting your search" : "Create your first room to start collaborating"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Room
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentRooms.map((room) => (
                  <div
                    key={room._id}
                    className="bg-white hover:bg-gray-50 border border-purple-200 hover:border-purple-300 rounded-xl p-4 transition-all duration-200 group cursor-pointer"
                    onClick={() => handleRoomJoin(room._id, room.name)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 truncate" title={room.name}>
                      {room.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                      <span>{getTimeAgo(room.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-purple-100">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredRooms.length)} of {filteredRooms.length} rooms
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === page
                              ? "bg-purple-600 text-white shadow-lg"
                              : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create New Room</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Name</label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && confirmCreate()}
                    placeholder="Enter room name..."
                    className="w-full border border-purple-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={closeModals}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmCreate}
                    disabled={loading || !roomName.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    {loading ? 'Creating...' : 'Create Room'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Join Room</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room ID</label>
                  <input
                    type="text"
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && confirmJoin()}
                    placeholder="Paste room ID here..."
                    className="w-full border border-purple-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Ask your teammate for the room ID to join their session
                  </p>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={closeModals}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmJoin}
                    disabled={loading || !joinId.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors"
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