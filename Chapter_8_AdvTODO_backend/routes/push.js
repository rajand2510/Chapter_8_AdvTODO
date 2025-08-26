const express = require('express');
const router = express.Router();
const User = require('../models/User');

// save subscription (client will POST the PushSubscription object)
router.post('/subscribe', async (req, res) => {
  const { sub, subscription } = req.body;
  if (!sub || !subscription) return res.status(400).json({ error: 'sub and subscription required' });
  const user = await User.findOneAndUpdate({ sub }, { $addToSet: { pushSubscriptions: subscription } }, { upsert: true, new: true });
  res.json({ ok: true });
});

// get vapid public key
router.get('/vapidPublicKey', (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
});

module.exports = router;
