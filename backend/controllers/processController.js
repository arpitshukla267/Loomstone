import ProcessSection from "../models/Process.js";
import cloudinary from "../config/cloudinary.js";

const removeImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed for process media:", err.message);
  }
};

// GET /api/process
export const getProcess = async (req, res) => {
  try {
    let doc = await ProcessSection.findOne();
    if (!doc) {
      doc = await ProcessSection.create({
        heading: "From Vision to Exceptional Spaces",
        intro:
          "At Loomstone, exceptional flooring begins with a clear vision and is realised through meticulous execution. We guide every project from concept to completion, creating floors that elevate the character and identity of a space.",
        steps: [],
      });
    }

    if (Array.isArray(doc.steps)) {
      doc.steps.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/process/section
export const updateProcessSection = async (req, res) => {
  try {
    let doc = await ProcessSection.findOne();
    if (!doc) {
      doc = new ProcessSection();
    }

    const { heading, intro } = req.body;
    if (heading !== undefined) doc.heading = heading;
    if (intro !== undefined) doc.intro = intro;

    await doc.save();
    res.json({
      heading: doc.heading,
      intro: doc.intro,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/process/steps
export const createStep = async (req, res) => {
  const uploaded = req.file;
  try {
    const { title, description, order } = req.body;
    if (!title || !title.trim()) {
      if (uploaded) await removeImage(uploaded.filename);
      return res.status(400).json({ message: "Step title is required" });
    }

    let doc = await ProcessSection.findOne();
    if (!doc) {
      doc = new ProcessSection();
    }

    const nextOrder =
      order !== undefined ? Number(order) : doc.steps.length;

    const newStep = {
      title: title.trim(),
      description: description ? description.trim() : "",
      media: uploaded ? uploaded.path : "",
      mediaPublicId: uploaded ? uploaded.filename : "",
      order: nextOrder,
    };

    doc.steps.push(newStep);
    await doc.save();

    const created = doc.steps[doc.steps.length - 1];
    res.status(201).json(created);
  } catch (err) {
    if (uploaded) await removeImage(uploaded.filename);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/process/steps/:id
export const updateStep = async (req, res) => {
  const uploaded = req.file;
  try {
    const { id } = req.params;
    const { title, description, order } = req.body;

    let doc = await ProcessSection.findOne();
    if (!doc) {
      if (uploaded) await removeImage(uploaded.filename);
      return res.status(404).json({ message: "Process section not found" });
    }

    const step = doc.steps.id(id);
    if (!step) {
      if (uploaded) await removeImage(uploaded.filename);
      return res.status(404).json({ message: "Process step not found" });
    }

    if (title !== undefined) step.title = title.trim();
    if (description !== undefined) step.description = description.trim();
    if (order !== undefined) step.order = Number(order);

    let oldMediaId = null;
    if (uploaded) {
      oldMediaId = step.mediaPublicId;
      step.media = uploaded.path;
      step.mediaPublicId = uploaded.filename;
    }

    await doc.save();

    if (uploaded && oldMediaId) {
      await removeImage(oldMediaId);
    }

    res.json(step);
  } catch (err) {
    if (uploaded) await removeImage(uploaded.filename);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/process/steps/:id
export const deleteStep = async (req, res) => {
  try {
    const { id } = req.params;
    let doc = await ProcessSection.findOne();
    if (!doc) {
      return res.status(404).json({ message: "Process section not found" });
    }

    const step = doc.steps.id(id);
    if (!step) {
      return res.status(404).json({ message: "Process step not found" });
    }

    if (step.mediaPublicId) {
      await removeImage(step.mediaPublicId);
    }

    doc.steps.pull({ _id: id });
    await doc.save();

    res.json({ message: "Process step deleted successfully", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/process/steps/reorder
export const reorderSteps = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "orderedIds array is required" });
    }

    let doc = await ProcessSection.findOne();
    if (!doc) {
      return res.status(404).json({ message: "Process section not found" });
    }

    const idToOrder = new Map(orderedIds.map((id, idx) => [String(id), idx]));

    doc.steps.forEach((step) => {
      const order = idToOrder.get(String(step._id));
      if (order !== undefined) {
        step.order = order;
      }
    });

    doc.steps.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    await doc.save();

    res.json({ message: "Steps reordered successfully", steps: doc.steps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
