const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = Schema(
  {
    content: { type: String, require: true },
    author: { type: Schema.Types.ObjectId, reuired: true, ref: "User" },
    post: { type: Schema.ObjectId, required: true, ref: "Post" },
    reactions: {
      like: { type: Number, default: 0 },
      dislike: { type: Number, default: 0 },
    },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
