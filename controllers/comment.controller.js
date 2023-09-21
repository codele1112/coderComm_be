const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const Friend = require("../models/Friend");

const commentController = {};

const calculateCommentCount = async (postId) => {
  const commentCount = await Comment.countDocuments({
    post: postId,
    isDeleted: false,
  });
  await Post.findByIdAndUpdate(postId, { commentCount: commentCount });
};
commentController.createNewComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { content, postId } = req.body;

  // check post exists
  const post = await Post.findById(postId);
  if (!post)
    throw new AppError(400, "Post not found", "Create New Comment Error");

  // create new comment
  let comment = await Comment.create({
    content,
    post: postId,
    author: currentUserId,
  });

  // update commentCount of the Post
  await calculateCommentCount(postId);

  comment = await comment.populate("author");

  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Create New Comment Successful"
  );
});

commentController.updateSingleComment = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  const commentId = req.params.id;
  const { content } = req.body;

  // check comment exists
  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, author: currentUserId },
    { content },
    { new: true }
  );

  if (!comment)
    throw new AppError(
      400,
      "Comment not found or User Not Authorized",
      "Update Comment Error"
    );

  //Response
  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Update comment Successful"
  );
});

commentController.deleteComment = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  const commentId = req.params.id;
  // Process
  let comment = await Comment.findOneAndDelete({
    _id: commentId,
    author: currentUserId,
  });
  if (!comment)
    throw new AppError(
      400,
      "Comment Not Found or User Not Authorized",
      "Delete Comment Error"
    );
  await calculateCommentCount(comment.post);
  //Response
  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Delete comment Successful"
  );
});

commentController.getSingleComment = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  const commentId = req.params.id;
  // Process
  let comment = await Comment.findById(commentId);
  if (!comment)
    throw new AppError(400, "Comment Not Found", "Get Single Comment Error");

  //Response
  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Get single comment Successful"
  );
});

module.exports = commentController;
