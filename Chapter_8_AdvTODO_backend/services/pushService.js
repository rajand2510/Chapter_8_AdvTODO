// services/pushService.js
const webpush = require('web-push');

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendPush = async (subscription, payload) => {
  // subscription is the object provided by browser client (PushSubscription)
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.warn('Push failed', err);
    return false;
  }
};

module.exports = { sendPush };
