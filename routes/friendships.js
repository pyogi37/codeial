const express = require("express");
const router = express.Router();
const passport = require("passport");

const friendshipController = require("../controllers/friendship_controller");

// router.get("/:userId/friendships", getFriendships);

router.post(
  "/make/:id",
  passport.checkAuthentication,
  friendshipController.toggleFriendship
);

module.exports = router;
