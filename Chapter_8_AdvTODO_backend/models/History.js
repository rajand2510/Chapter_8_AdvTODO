// models/History.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  taskText: { type: String, required: true },
  groupName: { type: String },
  subGroupName: { type: String },
  completedAt: { type: Date, default: Date.now },
  reminderWasSent: { type: Boolean, default: false },
  pushWasSent: { type: Boolean, default: false },
  originalTask: { type: Object },
  reason: { 
    type: String, 
    enum: ['completed','deleted','deleted_with_group','deleted_with_subgroup'], 
    default: 'completed' 
  }
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);
