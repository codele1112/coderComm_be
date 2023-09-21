const express = require("express");
const postController = require("../controllers/post.controller");

const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

const router = express.Router();

/**
 * @rout GET /posts/user/:userId?page=1&limit=10
 * @description get all posts a user can see  with pagination
 * @access Login required
 */
router.get(
  "/user/:userId",
  authentication.loginRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getPosts
);
/**
 * @rout POST /posts
 * @description create a new post
 * @body (content, image)
 * @access Login required
 */
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([body("content", "Missing Content").exists().notEmpty()]),
  postController.createPost
);
/**
 * @rout PUT /posts/:id
 * @description update a post
 * @body (content, image)
 * @access Login required
 */
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.updateSinglePost
);

/**
 * @rout DELETE /posts/:id
 * @description Delete a post
 * @access Login required
 */
router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.deletePost
);

/**
 * @rout GET /posts/:id
 * @description Get a single post
 * @access Login required
 */
router.get(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  postController.getSinglePost
);

/**
 * @rout GET /posts/:id/comments
 * @description Get comments of a post
 * @access Login required
 */
router.get(
  "/:id/comments",
  authentication.loginRequired,
  postController.getCommentsOfPost
);

module.exports = router;
