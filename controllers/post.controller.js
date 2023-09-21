const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Friend = require("../models/Friend");

const postController = {};

const calculatePostCount = async (userId) => {
  const postCount = await Post.countDocuments({
    author: userId,
    isDeleted: false,
  });

  await User.findByIdAndUpdate(userId, { postCount });
};

postController.getPosts = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  const userId = req.params.userId;
  let { page, limit, ...filter } = { ...req.query };

  // Validation
  const user = await User.findById(userId);
  if (!user) throw new AppError(400, "User Not Found", "Get Posts Error");
  // Process
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  let userFriendIDs = await Friend.find({
    $or: [{ from: userId }, { to: userId }],
    status: "accepted",
  });
  if (userFriendIDs && userFriendIDs.length) {
    userFriendIDs = userFriendIDs.map((friend) => {
      if (friend.from._id.equals(userId)) return friend.to;
      return friend.from;
    });
  } else {
    userFriendIDs = [];
  }
  userFriendIDs = [...userFriendIDs, userId];
  const filterConditions = [
    {
      isDeleted: false,
    },
    { author: { $in: userFriendIDs } },
  ];

  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Post.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let posts = await Post.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  //Response
  sendResponse(
    res,
    200,
    true,
    { posts, totalPages, count },
    null,
    "Get posts Successful"
  );
});

postController.createPost = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { content, image } = req.body;

  let post = await Post.create({ content, author: currentUserId, image });

  await calculatePostCount(currentUserId);

  post = await post.populate("author");

  return sendResponse(res, 200, true, post, null, "Create new post Successful");
});

postController.updateSinglePost = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  const postId = req.params.id;
  const { content, image } = req.body;
  // Validation
  let post = await Post.findById(postId);
  if (!post) throw new AppError(400, "Post Not Found", "Update Post Error");
  if (!post.author.equals(currentUserId))
    throw new AppError(400, "Only author can edit post", "Update Post Error");
  // Process
  const allows = ["content", "image"];

  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      post[field] = req.body[field];
    }
  });
  await post.save();
  //Response
  return sendResponse(res, 200, true, post, null, "Update post Successful");
});

postController.deletePost = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  const postId = req.params.id;
  // Process
  let post = await Post.findOneAndUpdate(
    { _id: postId, author: currentUserId },
    { isDeleted: true },
    { new: true }
  );
  if (!post)
    throw new AppError(
      400,
      "Post Not Found or User Not Authorized",
      "Delete Post Error"
    );
  await calculatePostCount(currentUserId);
  //Response
  return sendResponse(res, 200, true, post, null, "Delete post Successful");
});

postController.getSinglePost = catchAsync(async (req, res, next) => {
  // Get data from request
  const currentUserId = req.userId;
  const postId = req.params.id;
  // Process
  let post = await Post.findById(postId);
  if (!post) throw new AppError(400, "Post Not Found", "Get Single Post Error");

  post = post.toJSON();
  post.comments = await Comment.find({ post: post._id }).populate("author");

  //Response
  return sendResponse(res, 200, true, post, null, "Get post Successful");
});

postController.getCommentsOfPost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  let { page, limit } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  // validate post exists
  const post = await Post.findById(postId);
  if (!post)
    throw new AppError(400, "Post not Found, Get Comments of Post Error");
  // get comments
  const count = await Comment.countDocuments({ post: postId });
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  return sendResponse(
    res,
    200,
    true,
    { comments, totalPages, count },
    null,
    "Get comments of Post Successful"
  );
});

module.exports = postController;
