const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        require: true
    },
    body: {
        type: String,
        required: true
    },
    updated: Date,
    photo: {
        data: Buffer,
        contenType: String
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    writedBy: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now
    },
    update: Date,
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
        {
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: { type: ObjectId, ref: "User" }
        }
    ]
});

module.exports = mongoose.model("Post", postSchema);
