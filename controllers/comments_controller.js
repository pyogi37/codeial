const Comment = require("../models/comment");
const Post = require("../models/post");
const Like = require("../models/like");

const commentsMailer = require("../mailers/comments_mailer");
const queue = require("../config/kue");
const commentEmailWorker = require("../workers/comment_email_worker");

module.exports.create = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);
    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      post.comments.push(comment);
      post.save();

      comment = await comment.populate("user", "name email");
      // commentsMailer.newComment(comment);
      let job = queue.create("emails", comment).save(function (err) {
        if (err) {
          console.log("error in creating queue");
          return;
        }
        console.log("job enqueued", job.id);
      });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Comment created",
        });
      }

      req.flash("success", "Comment Posted Successfully");

      return res.redirect("back");
    }
  } catch (error) {
    req.flash("error", error);

    return res.redirect("/");
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    if (comment.user == req.user.id) {
      let post_id = comment.post;

      comment.remove();

      let post = Post.findByIdAndUpdate(post_id, {
        $pull: { comments: req.params.id },
      });

      // destroy the associated likes of the comment
      await Like.deleteMany({ likeable: comment._id, onModel: "Comment" });

      // send the comment id which was deleted back to the views
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Comment deleted",
        });
      }

      req.flash("success", "Comment Deleted!!");

      return res.redirect("back");
    } else {
      req.flash("error", "Unauthorized");
      return res.redirect("back");
    }
  } catch (error) {
    req.flash("error", error);

    return res.redirect("back");
  }
};
