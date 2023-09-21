const mongoose = require("mongoose");
const Reaction = require("../models/Reaction");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");

const reactionController = {};

const calculateReaction = async (targetId, targetType) => {
  const stats = await Reaction.aggregate([
    { $match: { targetId: new mongoose.Types.ObjectId(targetId) } },
    {
      $group: {
        _id: "$targetId",
        like: {
          $sum: {
            $cond: [{ $eq: ["$emoji", "like"] }, 1, 0],
          },
        },
        dislike: {
          $sum: {
            $cond: [{ $eq: ["$emoji", "dislike"] }, 1, 0],
          },
        },
      },
    },
  ]);
  const reactions = {
    like: (stats[0] && stats[0].like) || 0,
    dislike: (stats[0] && stats[0].dislike) || 0,
  };
  await mongoose.model(targetType).findByIdAndUpdate(targetId, { reactions });
  return reactions;
};

reactionController.saveReaction = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { targetType, targetId, emoji } = req.body;

  // Check targetType exists
  const targetObj = await mongoose.model(targetType).findById(targetId);
  if (!targetObj)
    throw new AppError(400, `${targetType} not found`, "Create Reaction Error");

  // Find the reaction if exists
  let reaction = await Reaction.findOne({
    targetType,
    targetId,
    author: currentUserId,
  });

  // If there is no previous reaction in the DB -> Create a new one
  if (!reaction) {
    reaction = await Reaction.create({
      targetType,
      targetId,
      author: req.userId,
      emoji,
    });
  } else {
    // If there is a previous reaction in the DB -> compare the emojis
    if (reaction.emoji === emoji) {
      // If they are the same -> delete the reaction
      await Reaction.deleteOne({ _id: reaction._id });
    } else {
      // If they are different -> update the reaction
      reaction.emoji;
      await reaction.save();
    }
  }

  const reactions = await calculateReaction(targetId, targetType);

  return sendResponse(
    res,
    200,
    true,
    reactions,
    null,
    "Save reaction successful"
  );
});

module.exports = reactionController;
