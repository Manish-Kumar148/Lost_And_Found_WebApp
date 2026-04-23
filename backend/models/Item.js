const mongoose = require('mongoose');

const itemSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Student',
    },
    itemName: {
      type: String,
      required: [true, 'Please add an item name'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    type: {
      type: String,
      required: [true, 'Please specify if lost or found'],
      enum: ['Lost', 'Found'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
      default: Date.now,
    },
    contactInfo: {
      type: String,
      required: [true, 'Please add contact information'],
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
