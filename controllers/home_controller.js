const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  try {
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
        populate: {
          path: "likes",
        },
      })
      .populate("likes");

    let users = await User.find({});
    console.log("all posts*****************", posts);

    // search friends of the logged in user
    if (req.user) {
      const friendIds = req.user.friendships;
      User.find({ _id: { $in: friendIds } }, (err, friends) => {
        // find the friends by their IDs
        if (err) {
          console.error(err); // handle any errors
          return;
        }

        console.log("FRIENDS", friends); // do something with the friends array
      });
    }

    return res.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
    });
  } catch (error) {
    console.log("Error==>", error);
    return;
  }
};
