// controllers/taskController.js
const Task = require('../models/Task');
const Group = require('../models/Group');
const SubGroup = require('../models/SubGroup');
const History = require('../models/History');
const User = require('../models/User');
const agenda = require('../config/agenda');
const { sendReminderEmail } = require('../services/mailer');
const { sendPush } = require('../services/pushService');

const scheduleReminderJob = async (task) => {
  if (!task.reminder || !task.reminder.enabled || !task.reminder.at) return;
  // Create a job keyed by task id (unique)
  await agenda.cancel({ name: `reminder-${task._id}` });
  await agenda.schedule(task.reminder.at, `reminder-${task._id}`, { taskId: task._id.toString() });
};

const createTask = async (req, res) => {
  try {
    const { userSub, groupId, subGroupId, text, priority, date, reminder } = req.body;
    const task = await Task.create({ userSub, groupId, subGroupId, text, priority, date, reminder });
    if (reminder && reminder.enabled && reminder.at) {
      await scheduleReminderJob(task);
    }
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.reminder && task.reminder.enabled && task.reminder.at) await scheduleReminderJob(task);
    else await agenda.cancel({ name: `reminder-${task._id}` });
    res.json(task);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const completeTask = async (req, res) => {
  // mark completed, move to history with details
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.completed = true;
    await task.save();

    const group = await Group.findById(task.groupId);
    const subGroup = await SubGroup.findById(task.subGroupId);

    const history = await History.create({
      userSub: task.userSub,
      taskText: task.text,
      groupName: group ? group.name : '',
      subGroupName: subGroup ? subGroup.name : '',
      completedAt: new Date(),
      reminderWasSent: task.reminderSent,
      pushWasSent: task.pushSent,
      originalTask: task.toObject()
    });

    // optionally remove the task from tasks collection
    await Task.findByIdAndDelete(task._id);
    // cancel any future reminder job
    await agenda.cancel({ name: `reminder-${task._id}` });

    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const listTasks = async (req, res) => {
  try {
    const { userSub } = req.query;
    const tasks = await Task.find({ userSub }).populate('groupId').populate('subGroupId');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getUserTasks = async (req, res) => {
  try {
    const userId = req.user._id; // comes from auth middleware

    // Find groups of the authenticated user
    const groups = await Group.find({ userId })
      .populate({
        path: "subGroups",
        match: { userId }, // ensure only this user's subgroups
        populate: {
          path: "tasks",
          match: { userId }, // ensure only this user's tasks
        },
      });

    res.json(groups);
  } catch (err) {
    console.error("getUserTasks error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = { createTask, updateTask, completeTask, listTasks, scheduleReminderJob, getUserTasks };
