const express = require("express");
const router = express.Router();

const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");
const friendController = require("../controllers/friend.controller");

/**
 * @rout POST /friends/requests
 * @description Send a friend request
 * @body {to: User ID}
 * @access Login required
 */
router.post(
  "/requests",
  authentication.loginRequired,
  validators.validate([
    body("to", "Missing userId")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  friendController.sendFriendRequest
);
/**
 * @rout GET /friends/requests/incoming
 * @description get the list of recieved pending requests
 * @access Login required
 */

router.get(
  "/requests/incoming",
  authentication.loginRequired,
  friendController.getReceivedFriendRequestList
);
/**
 * @rout GET /friends/requests/outcoming
 * @description get the list of sent pending requests
 * @access Login required
 */

router.get(
  "/requests/outcoming",
  authentication.loginRequired,
  friendController.getSentFriendRequestList
);
/**
 * @rout GET /friends
 * @description get the list of friends
 * @access Login required
 */

router.get("/", authentication.loginRequired, friendController.getFriendList);
/**
 * @rout PUT /friends/requests/:userId
 * @description Accept/Reject a received pending request
 *@body {status: 'accepted' or 'declined'}
 * @access Login required
 */
router.put(
  "/requests/:userId",
  authentication.loginRequired,
  validators.validate([
    param("userId", "Invalid userId")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
    body("status", "Missing status")
      .exists()
      .isString()
      .isIn(["accepted", "declined"]),
  ]),
  friendController.reactFriendRequest
);
/**
 * @rout DELETE /friends/requests/:userId
 * @description Cancel a friend request
 * @access Login required
 */
router.delete(
  "/requests/:userId",
  authentication.loginRequired,
  validators.validate([
    param("userId", "Invalid userId")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  friendController.cancelFriendRequest
);
/**
 * @rout DELETE /friends/:userId
 * @description Removed a friend
 * @access Login required
 */
router.delete(
  "/:userId",
  authentication.loginRequired,
  validators.validate([
    param("userId", "Invalid userId")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  friendController.removeFriend
);
module.exports = router;
