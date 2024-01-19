const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  lastDaily: {
    type: Date,
    reqired: true,
  },
  work_cooldown_time: {
    type: Number,
    default: 300,
  },
  work_cooldown: {
    type: Number,
    default: 0,
  },
  work_multiple: {
    type: Number,
    default: 1,
  },
  bank: {
    type: Number,
  },
  rob: {
    type: Boolean,
    default: true,
  },
  rob_cooldown: {
    type: Number,
    default: 0
  },
  rob_cooldown_time: {
    type: Number,
    default: 600,
  },
  crime_cooldown: {
    type: Number,
  },
  crime_cooldown_time: {
    type: Number,
    default: 120,
  },
  crime_multiple: {
    type: Number,
    default: 1,
  },
});

module.exports = model('User', userSchema);