const Friendship = require("../models/friendship");
const User = require("../models/user");

module.exports.getFriendships = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("friendships");
    res.json(user.friendships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.toggleFriendship = async (req, res) => {
  try {
    console.log("USERID", req.user._id.toString());
    console.log("FRIENDID", req.params.id.toString());
    console.log("Type", typeof req.params.id);

    const fromUser = await User.findById(req.user.id.toString());
    let deleted = false;
    const toUser = await User.findOne({ id: req.params.id });
    // console.log("TOUSER FRIENDS", toUser);

    // check if friendship already exists

    const friendship = await Friendship.findOne({
      $or: [
        { from_user: fromUser.id, to_user: toUser.id },
        { from_user: toUser.id, to_user: fromUser.id },
      ],
    });

    // if a friendship already exists then delete it

    if (friendship) {
      toUser.frienships.pull(friendship);
      fromUser.frienships.pull(friendship);

      toUser.save();
      fromUser.save();

      // console.log("touser friends", toUser.frienships);
      // console.log("from user friends", fromUser.frienships);
      await friendship.remove();

      deleted = true;
    } else {
      //else make a new friendship
      const newFriendship = new Friendship({
        from_user: fromUser.id,
        to_user: toUser.id,
      });
      await newFriendship.save();

      console.log("NEW FRIENDSHIP", newFriendship);
      fromUser.frienships.push(newFriendship);
      toUser.frienships.push(newFriendship);
      fromUser.save();
      toUser.save();
      // console.log(fromUser.friendships);
      // toUser.friendships.push(newFriendship);
    }

    return res.json(200, {
      message: "Request Successful!",
      data: {
        deleted: deleted,
      },
    });
  } catch (error) {
    console.log(error);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
