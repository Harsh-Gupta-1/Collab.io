import Room from "../models/Room.js";

export const getUserRooms = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const rooms = await Room.find({ participants: userId }).select("name createdAt");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user rooms" });
  }
};