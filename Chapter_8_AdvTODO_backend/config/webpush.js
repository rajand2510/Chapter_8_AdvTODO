const webpush = require("web-push");

// Hardcoded VAPID keys and subject
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "BAdG3eDzTUy9Lb2Mvpsoxsr00c7hS5Uk5q64Bc4uVk-mvN3c95XvlDc8uE9KVnQVl2-coP4Y0DpJRJ9bs3qSLKg";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "vWIM7rr4eCtu2DJdoXQnlXxXD1AF5g-sfEFz8IZeM1U";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:rajansatvara@gmail.com";

webpush.setVapidDetails(
  VAPID_SUBJECT,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

module.exports = webpush;
