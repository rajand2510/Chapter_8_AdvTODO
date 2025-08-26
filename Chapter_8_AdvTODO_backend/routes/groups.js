// routes/groupRoutes.js
const express = require("express");
const Group = require("../models/Group");
const SubGroup = require("../models/SubGroup");
const Task = require("../models/Task");
const History = require("../models/History");
const auth = require("../middleware/auth");

const router = express.Router();

async function createHistoryFromTask(task, reason = "deleted_with_group") {
  let groupName = "";
  let subGroupName = "";
  if (task.subGroupId) {
    const sub = await SubGroup.findById(task.subGroupId).populate("groupId");
    if (sub) {
      subGroupName = sub.name || "";
      groupName = sub.groupId ? sub.groupId.name : "";
    }
  }

  return await History.create({
    userId: task.userId,
    taskText: task.text,
    groupName,
    subGroupName,
    completedAt: new Date(),
    reminderWasSent: !!task.reminderSent,
    pushWasSent: !!task.pushSent,
    originalTask: task.toObject(),
    reason,
  });
}

// Create group
router.post("/", auth, async (req, res) => {
  try {
    const group = new Group({ name: req.body.name, userId: req.user._id });
    await group.save();
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List groups
router.get("/", auth, async (req, res) => {
  try {
    const groups = await Group.find({ userId: req.user._id });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete group -> move tasks under subgroups to history, delete tasks & subgroups & group
router.delete("/:id", auth, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, userId: req.user._id });
    if (!group) return res.status(404).json({ error: "Group not found" });

    // find subgroups under this group
    const subgroups = await SubGroup.find({ groupId: group._id, userId: req.user._id });

    // for each subgroup, find tasks and move them to history
    for (const sg of subgroups) {
      const tasks = await Task.find({ subGroupId: sg._id, userId: req.user._id });
      for (const t of tasks) {
        await createHistoryFromTask(t, "deleted_with_group");
        await Task.findByIdAndDelete(t._id);
      }
    }

    // delete subgroups
    await SubGroup.deleteMany({ groupId: group._id, userId: req.user._id });

    // delete group
    await Group.findByIdAndDelete(group._id);

    res.json({ message: "Group, subgroups and related tasks moved to history & deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
