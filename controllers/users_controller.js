const User = require("../models/users");

module.exports.profile = function (req, res) {
  if (req.cookies.user_id) {
    User.findById(req.cookies.user_id, function (err, user) {
      if (user) {
        return res.render("user_profile", {
          title: "Profile",
          user: user,
        });
      }
      return res.redirect("/users/sign-in");
    });
  } else {
    return res.redirect("/users/sign-in");
  }
};

// render sign in page
module.exports.signIn = function (req, res) {
  return res.render("user_sign_in", {
    title: "Codeal | Sign In",
  });
};

// render signup page
module.exports.signUp = function (req, res) {
  return res.render("user_sign_up", {
    title: "Codeal | Sign Up",
  });
};

// get sign up data
module.exports.create = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user in signing up");
      return;
    }
    if (!user) {
      User.create(req.body, function (err, user) {
        if (err) {
          console.log("error in creating new user");
          return;
        }
        return res.redirect("/users/sign-in");
      });
    } else {
      return res.redirect("back");
    }
  });
};

// sign in and creat a session for user
module.exports.createSession = function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error in finding user in signing in");
      return;
    }
    // handle user found
    if (user) {
      // handle pwd which doesnt match
      if (user.password != req.body.password) {
        return res.redirect("back");
      }

      // handle session creation
      res.cookie("user_id", user.id);
      return res.redirect("/users/profile");
    } else {
      // handle user not found
      return res.redirect("back");
    }
  });
};

module.exports.signOut = function (req, res) {
  res.cookie("user_id", 0);
  return res.redirect("/users/sign-in");
};
