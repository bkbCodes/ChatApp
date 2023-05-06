const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
        username: {
            type: String,
            unique : true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    }
);

// collection will have a name "GroupChat"
module.exports = mongoose.model("Users", userSchema);