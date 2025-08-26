const Group = require("../models/Group");
const SubGroup = require("../models/SubGroup");
const Task = require("../models/Task");

const createGroup = async (req, res) => {
  try {
    const { userSub, name } = req.body;
    if (!userSub || !name) return res.status(400).json({ error: "userSub and name required" });

    const group = await Group.create({ userSub, name });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listGroups = async (req, res) => {
  try {
    const { userSub } = req.query;
    const groups = await Group.find({ userSub });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByIdAndDelete(id);
    if (!group) return res.status(404).json({ error: "Group not found" });

    // Delete all subgroups and tasks under this group
    const subGroups = await SubGroup.find({ groupId: id });
    for (const sg of subGroups) {
      await Task.deleteMany({ subGroupId: sg._id });
    }
    await SubGroup.deleteMany({ groupId: id });

    res.json({ message: "Group and related subgroups/tasks deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createGroup, listGroups, deleteGroup };
