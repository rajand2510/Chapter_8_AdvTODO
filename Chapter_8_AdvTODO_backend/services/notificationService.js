const webpush = require("../config/webpush");

async function sendPushNotification(subscription, task) {
  try {
    const appUrl = process.env.APP_BASE_URL;

    const payload = {
      title: "Task Reminder",
      body: task.text,
      url: `${appUrl}/tasks/${task._id}`, // 👈 link to frontend
    };

    await webpush.sendNotification(subscription, JSON.stringify(payload));
    console.log("🔔 Push sent");
  } catch (err) {
    console.error("❌ Push error:", err.message);
  }
}

module.exports = { sendPushNotification };
