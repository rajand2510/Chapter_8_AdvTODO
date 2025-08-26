const cron = require("node-cron");
const Task = require("../models/Task");
const User = require("../models/User");
const { sendEmail } = require("../services/emailService");
const { sendPushNotification } = require("../services/notificationService");

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    // Find tasks with reminders, not yet sent, and due time has passed
    const tasks = await Task.find({
      reminder: true,
      reminderSent: false,
      date: { $lte: now },
    }).populate("userId");

    for (const task of tasks) {
      const user = task.userId;

      if (!user) continue;

      // Send email if user has email
      if (user.email) {
        console.log(`📧 Sending email to: ${user.email}, ${task.text}`);
        await sendEmail(user.email, "Task Reminder", task);
      }

      // Send push notifications if user has subscriptions
      if (user.pushSubscriptions && user.pushSubscriptions.length > 0) {
        for (const sub of user.pushSubscriptions) {
          await sendPushNotification(sub, {
            title: "Task Reminder",
            body: task,
          });
        }
      }

      // Mark reminder as sent
      task.reminderSent = true;
      await task.save();

      console.log(`🔔 Reminder sent for task: ${task.text}`);
    }
  } catch (err) {
    console.error("Scheduler error:", err.message);
  }
});
