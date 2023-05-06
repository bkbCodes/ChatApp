const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Users',
        required: true,
    },
    sender: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
    }
  });

const gcSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        members: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Users'
        }],
        messages: [messageSchema]
    },
    {
        timestamps: true,
    }
);

// collection will have a name "GroupChat"
module.exports = mongoose.model("GroupChat", gcSchema);