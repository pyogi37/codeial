const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    .sort("-createdAt")
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });

  return res.status(200).json({
    message: "List of posts",
    posts: posts,
  });
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    // console.log(post.user);
    console.log(req.user.id);

    if (post.user == req.user.id) {
      post.remove();
      await Comment.deleteMany({ post: req.params.id });

      return res.json(200, {
        message: "Post and related comments deleted",
      });
    } else {
      return res.json(401, {
        message: "you cannot delete this post",
      });
    }
  } catch (error) {
    console.log("*********", error);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
