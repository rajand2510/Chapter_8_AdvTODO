const SubGroup = require("../models/SubGroup");
const Task = require("../models/Task");

const createSubGroup = async (req, res) => {
  try {
    const { groupId, name, color } = req.body;
    if (!groupId || !name) return res.status(400).json({ error: "groupId and name required" });

    const subGroup = await SubGroup.create({ groupId, name, color });
    res.json(subGroup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listSubGroups = async (req, res) => {
  try {
    const { groupId } = req.query;
    const subGroups = await SubGroup.find({ groupId });
    res.json(subGroups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteSubGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const subGroup = await SubGroup.findByIdAndDelete(id);
    if (!subGroup) return res.status(404).json({ error: "SubGroup not found" });

    // Delete all tasks under this subgroup
    await Task.deleteMany({ subGroupId: id });

    res.json({ message: "SubGroup and related tasks deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createSubGroup, listSubGroups, deleteSubGroup };
