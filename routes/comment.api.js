const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");

const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");
/**
 * @rout POST /comments
 * @description create a new comment
 * @body {content, postId}
 * @access Login required
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("content", "Missing Content").exists().notEmpty(),
    body("postId", "Missing postId")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  commentController.createNewComment
);
/**
 * @rout PUT /comments/:id
 * @description update a comment
 * @access Login required
 */
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  commentController.updateSingleComment
);
/**
 * @rout DELETE /comments/:id
 * @description delete a comment
 * @access Login required
 */
router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  commentController.deleteComment
);

/**
 * @rout GET /comments/:id
 * @description get detail of a comment
 * @access Login required
 */

router.get(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  commentController.getSingleComment
);
module.exports = router;
