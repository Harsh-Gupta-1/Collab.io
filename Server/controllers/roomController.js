import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user?.userId;
    if (!name || !userId) {
      return res.status(400).json({ error: "Name and user ID are required" });
    }
    const room = new Room({ name, participants: [userId] });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getRoom = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    // Add user to participants if not already present
    if (!room.participants.includes(userId)) {
      room.participants.push(userId);
      await room.save();
    }
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { whiteboardData, codeSnippet } = req.body;
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { whiteboardData, codeSnippet },
      { new: true }
    );
    res.json(room);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};