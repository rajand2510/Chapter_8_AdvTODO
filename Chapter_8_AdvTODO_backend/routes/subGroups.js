// routes/subGroupRoutes.js
const express = require("express");
const SubGroup = require("../models/SubGroup");
const Task = require("../models/Task");
const History = require("../models/History");
const auth = require("../middleware/auth");

const router = express.Router();

async function createHistoryFromTask(task, reason = "deleted_with_subgroup") {
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

// Create subGroup
router.post("/", auth, async (req, res) => {
  try {
    const subGroup = await SubGroup.create({ 
      name: req.body.name, 
      color: req.body.color, 
      groupId: req.body.groupId, 
      userId: req.user._id 
    });
    res.json(subGroup);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List subgroups
router.get("/", auth, async (req, res) => {
  try {
    const subs = await SubGroup.find({ userId: req.user._id });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete subGroup -> move tasks to history then delete subgroup
router.delete("/:id", auth, async (req, res) => {
  try {
    const subGroup = await SubGroup.findOne({ _id: req.params.id, userId: req.user._id });
    if (!subGroup) return res.status(404).json({ error: "SubGroup not found" });

    const tasks = await Task.find({ subGroupId: subGroup._id, userId: req.user._id });
    for (const t of tasks) {
      await createHistoryFromTask(t, "deleted_with_subgroup");
      await Task.findByIdAndDelete(t._id);
    }

    await SubGroup.findByIdAndDelete(subGroup._id);

    res.json({ message: "SubGroup deleted and related tasks moved to history" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
