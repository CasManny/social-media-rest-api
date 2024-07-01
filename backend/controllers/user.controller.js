import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { Story } from "../models/story.model.js";

export const getSingleUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not Found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserInfo = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "NO user Found" });
    }

    Object.keys(updateData).forEach((key) => {
      user[key] = updateData[key];
    });

    const updatedUser = await user.save();
    updatedUser.password = null;
    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const userToFollow = await User.findById(req.params.userId);

    if (!userToFollow) {
      return res
        .status(404)
        .json({ error: "user you wanted to follow do not exist" });
    }

    if (currentUser._id === userToFollow._id) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    if (userToFollow.followers.includes(currentUser._id)) {
      return res.status(400).json({ error: "You are already following user" });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    return res
      .status(200)
      .json({ message: `You are following ${userToFollow.username}` });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const userToUnfollow = await User.findById(req.params.userId);

    if (!userToUnfollow) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!userToUnfollow.following.includes(currentUser._id)) {
      return res.status(400).json({ error: "You are not following user" });
    }

    if (currentUser._id === userToUnfollow._id) {
      return res.status(400).json({ error: "You cannot unfollow yourself" });
    }

    currentUser.following.pull(userToUnfollow._id);
    userToUnfollow.followers.pull(currentUser._id);

    await currentUser.save();
    await userToUnfollow.save();

    return res
      .status(200)
      .json({ message: `You have unfollowed ${userToUnfollow.username}` });
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const userToBlock = await User.findById(req.params.userId);

    if (!userToBlock) {
      return res.status(400).json({ error: "User not found" });
    }

    if (currentUser._id === userToBlock._id) {
      return res.status(400).json({ error: "You cannot block yourself" });
    }

    if (currentUser.blockList.includes(userToBlock._id)) {
      return res.status(400).json({ error: "User is already blocked" });
    }

    currentUser.blockList.push(userToBlock._id);

    currentUser.following = currentUser.following.filter(
      (user) => user !== userToBlock._id
    );
    userToBlock.followers = userToBlock.followers.filter(
      (user) => user !== currentUser._id
    );
    await currentUser.save();

    return res.status(200).json({
      message: `You have succesfully blocked ${userToBlock.username}`,
    });
  } catch (error) {
    next(error);
  }
};

export const unBlockUser = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const userToUnBlock = await User.findById(req.params.userId);

    if (!userToUnBlock) {
      return res.status(400).json({ error: "User not Found" });
    }

    if (currentUser._id === userToUnBlock._id) {
      return res.status(400).json({ error: "You cannot unblock yourself" });
    }

    if (!currentUser.blockList.includes(userToUnBlock._id)) {
      return res.status(400).json({ error: "You are not blocking this user" });
    }

    if (currentUser.blockList.includes(userToUnBlock._id)) {
      currentUser.blockList.pull(userToUnBlock._id);
    }

    await currentUser.save();

    return res.status(200).json({
      message: `You have successfully unblocked ${userToUnBlock.username}`,
    });
  } catch (error) {
    next(error);
  }
};

export const retrieveBlockedUsers = async (req, res, next) => {
  try {
    const blockedUsers = await User.findById(req.params.userId)
      .select("-password")
      .populate({
        path: "blockList",
        select: "_Id username fullName profilePicture",
      });

    return res.status(200).json({ blocked_user: blockedUsers.blockList });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      return res.status(404).json({ error: "User not found" });
    }

    await Post.deleteMany({ user: userId });
    await Post.deleteMany({ "comments.user": userId });
    await Post.deleteMany({ "comments.replies.user": userId });
    await Comment.deleteMany({ user: userId });
    await Story.deleteMany({ user: userId });
    await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });
    await User.updateMany(
      { _id: { $in: userToDelete.following } },
      { $pull: { followers: userId } }
    );
    await Comment.updateMany(
      { likes: { $in: userId } },
      { $pull: { likes: userId } }
    );
    await Comment.updateMany(
      { replies: { $in: userId } },
      { $pull: { replies: userId } }
    );
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    next(error);
  }
};
