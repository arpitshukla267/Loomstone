import Room from "../models/rooms.js";
import cloudinary from "../config/cloudinary.js";

// "Hallway & Entryway" -> /products?room=Hallway+%26+Entryway
const buildHref = (name) =>
  `/products?room=${encodeURIComponent(name).replace(/%20/g, "+")}`;

const removeImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed:", err.message);
  }
};

// Public: sirf active. Admin: ?all=true se saari
export const getRooms = async (req, res) => {
  try {
    const filter = req.query.all === "true" ? {} : { isActive: true };
    const rooms = await Room.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createRoom = async (req, res) => {
  const uploaded = req.file; // multer ye pehle hi Cloudinary par daal chuka hota hai
  try {
    const { name, heading, desc, href, order, isActive } = req.body;

    if (!name?.trim() || !desc?.trim()) {
      await removeImage(uploaded?.filename);
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }
    if (!uploaded) {
      return res.status(400).json({ message: "Image is required" });
    }

    const room = await Room.create({
      name,
      heading: heading?.trim() || name.trim(), // heading khali ho to name hi heading ban jata hai
      desc,
      image: uploaded.path,
      imageId: uploaded.filename,
      href: href?.trim() || buildHref(name.trim()),
      order,
      isActive,
    });

    res.status(201).json(room);
  } catch (err) {
    await removeImage(uploaded?.filename); // DB fail ho to kachra na bache
    res.status(500).json({ message: err.message });
  }
};

export const updateRoom = async (req, res) => {
  const uploaded = req.file;
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      await removeImage(uploaded?.filename);
      return res.status(404).json({ message: "Room not found" });
    }

    const oldName = room.name;
    const oldAutoHref = buildHref(oldName);

    const fields = ["name", "heading", "desc", "href", "order", "isActive"];
    for (const f of fields) {
      if (req.body[f] !== undefined) room[f] = req.body[f];
    }

    if (!room.heading?.trim()) room.heading = room.name;

    // href auto tha aur naam badla, to href bhi naye naam se bana do
    if (
      room.name !== oldName &&
      (!req.body.href || req.body.href === oldAutoHref)
    ) {
      room.href = buildHref(room.name);
    }

    const oldImageId = room.imageId;
    if (uploaded) {
      room.image = uploaded.path;
      room.imageId = uploaded.filename;
    }

    await room.save();

    // save safal hone ke baad hi purani image hatao
    if (uploaded) await removeImage(oldImageId);

    res.json(room);
  } catch (err) {
    await removeImage(uploaded?.filename);
    res.status(500).json({ message: err.message });
  }
};

export const toggleRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    room.isActive = !room.isActive;
    await room.save();
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.imageId) await cloudinary.uploader.destroy(room.imageId);
    await room.deleteOne();

    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
