const express = require("express");
const reactionController = require("../controllers/reaction.controller");

const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

const router = express.Router();

/**
 * @rout POST /reactions
 * @description save a reaction for post or comment
 * @body {targetType: 'Post' or 'Comment', targetId, emoji: 'like' or 'dislike' }
 * @access Login required
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("targetType", "Invalid targetType").exists().isIn(["Post", "Comment"]),
    body("targetId", "Invalid targetId")
      .exists()
      .custom(validators.checkObjectId),
    body("emoji", "Invalid emoji").exists().isIn(["like", "dislike"]),
  ]),
  reactionController.saveReaction
);
module.exports = router;
