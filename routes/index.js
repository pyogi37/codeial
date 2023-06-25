const express = require("express");

const router = express.Router();

const homeController = require("../controllers/home_controller");
const passport = require("passport");

console.log("Router loaded");

router.get("/", passport.checkAuthentication, homeController.home);
router.use("/users", require("./users"));
router.use("/posts", require("./posts"));
router.use("/comments", require("./comments"));
router.use("/likes", require("./likes"));
router.use("/friendships", require("./friendships"));

router.use("/api", require("./api"));
// router.use("/reset_password", require("./reset_password"));

module.exports = router;
