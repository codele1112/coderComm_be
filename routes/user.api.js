const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");
/**
 * @rout POST /users
 * @description Register new user
 * @body (name, email, password)
 * @access Public
 */

router.post(
  "/",
  validators.validate([
    body("name", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  userController.register
);
/**
 * @rout GET /users?page=1&limit=10
 * @description get users with pagination
 * @body (name, email, password)
 * @access Login required
 */

router.get("/", authentication.loginRequired, userController.getUsers);
/**
 * @rout GET /users/me
 * @description get current user info
 * @access Login required
 */
router.get("/me", authentication.loginRequired, userController.getCurrentUser);
/**
 * @rout GET /users/:id
 * @description get a user profile
 * @access Login required
 */
router.get(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.getSingleUser
);
/**
 * @rout PUT /users/:id
 * @description Update user profile
 * @body (name, avatarUrl, coverUrl,aboutme, city, country, company, job title, facebookLink,InstagramLink, LinkedInLink,...)
 * @access Login required
 */
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.updateProfile
);

module.exports = router;
