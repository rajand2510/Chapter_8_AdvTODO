// routes/taskRoutes.js
const express = require("express");
const Task = require("../models/Task");
const SubGroup = require("../models/SubGroup");
const Group = require("../models/Group");
const History = require("../models/History");
const auth = require("../middleware/auth");

const router = express.Router();

async function createHistoryFromTask(task, reason = "completed") {
  // Fetch subgroup and group names if available
  let groupName = "";
  let subGroupName = "";

  if (task.subGroupId) {
    const sub = await SubGroup.findById(task.subGroupId).populate("groupId");
    if (sub) {
      subGroupName = sub.name || "";
      groupName = sub.groupId ? sub.groupId.name : "";
    }
  }

  const hist = await History.create({
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

  return hist;
}

// -------------------------
// CRUD Routes
// -------------------------

// Create task
router.post("/", auth, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user._id });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get tasks (flat list)
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ New: Get tasks grouped by Group → SubGroup → Task
router.get("/nested", auth, async (req, res) => {
  try {
    const groups = await Group.find({ userId: req.user._id })
      .populate({
        path: "subGroups",
        match: { userId: req.user._id },
        populate: {
          path: "tasks",
          match: { userId: req.user._id },
        },
      });

    res.json(groups);
  } catch (err) {
    console.error("Nested task fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update task
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark complete → move to history
router.put("/:id/complete", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    const history = await createHistoryFromTask(task, "completed");
    await Task.findByIdAndDelete(task._id);

    res.json({ message: "Task completed and moved to history", history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete task → move to history
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
    if (!task) return res.status(404).json({ error: "Task not found" });

    const history = await createHistoryFromTask(task, "deleted");
    await Task.findByIdAndDelete(task._id);

    res.json({ message: "Task deleted and moved to history", history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
