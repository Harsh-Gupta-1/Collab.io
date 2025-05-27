import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const room = new Room({ name });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ error: "Room not found" });
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
