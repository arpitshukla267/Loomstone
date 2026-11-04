import { ClienteleSection, ClientLogo } from "../models/Clientele.js";
import cloudinary from "../config/cloudinary.js";

const removeImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Cloudinary delete failed for client logo:", err.message);
  }
};

// GET /api/clientele
export const getClientele = async (req, res) => {
  try {
    let section = await ClienteleSection.findOne();
    if (!section) {
      section = await ClienteleSection.create({
        heading: "Built on Expertise.",
        headingHighlight: "Defined by Trust.",
        description:
          "We partner with architects, designers, developers and hospitality groups to deliver tailored flooring solutions, backed by design collaboration, quality and dependable project coordination.",
        subheading: "Thoughtful Collaboration. Lasting Partnerships.",
        testimonialsHeading: "What Our Clients Says",
        testimonials: [],
      });
    }

    const filter = req.query.all === "true" ? {} : { isActive: true };
    const clients = await ClientLogo.find(filter).sort({ order: 1, createdAt: 1 });

    res.json({
      heading: section.heading,
      headingHighlight: section.headingHighlight,
      description: section.description,
      subheading: section.subheading,
      testimonialsHeading: section.testimonialsHeading,
      testimonials: section.testimonials,
      clients,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/clientele/section
export const updateClienteleSection = async (req, res) => {
  try {
    let section = await ClienteleSection.findOne();
    if (!section) {
      section = new ClienteleSection();
    }

    const {
      heading,
      headingHighlight,
      description,
      subheading,
      testimonialsHeading,
      testimonials,
    } = req.body;

    if (heading !== undefined) section.heading = heading;
    if (headingHighlight !== undefined) section.headingHighlight = headingHighlight;
    if (description !== undefined) section.description = description;
    if (subheading !== undefined) section.subheading = subheading;
    if (testimonialsHeading !== undefined)
      section.testimonialsHeading = testimonialsHeading;

    if (testimonials !== undefined) {
      try {
        const parsed =
          typeof testimonials === "string"
            ? JSON.parse(testimonials)
            : testimonials;
        if (Array.isArray(parsed)) {
          section.testimonials = parsed;
        }
      } catch (e) {
        console.error("Failed to parse testimonials", e);
      }
    }

    await section.save();
    res.json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/clientele/clients
export const createClientLogo = async (req, res) => {
  const file = req.file;
  try {
    const { name, order } = req.body;
    if (!name || !name.trim()) {
      if (file) await removeImage(file.filename);
      return res.status(400).json({ message: "Client name is required" });
    }
    if (!file) {
      return res.status(400).json({ message: "Client logo file is required" });
    }

    const count = await ClientLogo.countDocuments();
    const parsedOrder = order !== undefined ? Number(order) : count;

    const client = await ClientLogo.create({
      name: name.trim(),
      logo: file.path,
      logoPublicId: file.filename,
      order: parsedOrder,
      isActive: true,
    });

    res.status(201).json(client);
  } catch (err) {
    if (file) await removeImage(file.filename);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/clientele/clients/:id
export const updateClientLogo = async (req, res) => {
  const file = req.file;
  try {
    const { id } = req.params;
    const client = await ClientLogo.findById(id);
    if (!client) {
      if (file) await removeImage(file.filename);
      return res.status(404).json({ message: "Client logo not found" });
    }

    const { name, order, isActive } = req.body;
    if (name && name.trim()) client.name = name.trim();
    if (order !== undefined) client.order = Number(order);
    if (isActive !== undefined) client.isActive = isActive === "true" || isActive === true;

    let oldImageId = null;
    if (file) {
      oldImageId = client.logoPublicId;
      client.logo = file.path;
      client.logoPublicId = file.filename;
    }

    await client.save();

    if (oldImageId) {
      await removeImage(oldImageId);
    }

    res.json(client);
  } catch (err) {
    if (file) await removeImage(file.filename);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/clientele/clients/:id
export const deleteClientLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await ClientLogo.findById(id);
    if (!client) {
      return res.status(404).json({ message: "Client logo not found" });
    }

    if (client.logoPublicId) {
      await removeImage(client.logoPublicId);
    }

    await ClientLogo.findByIdAndDelete(id);
    res.json({ message: "Client logo deleted successfully", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/clientele/clients/reorder
export const reorderClientLogos = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "orderedIds array is required" });
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));

    if (bulkOps.length > 0) {
      await ClientLogo.bulkWrite(bulkOps);
    }

    res.json({ message: "Client logos reordered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
