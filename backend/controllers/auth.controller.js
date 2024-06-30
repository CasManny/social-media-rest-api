import { generateTokenAndSetTokens } from "../lib/generateAndSetTokens.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res, next) => {
  try {
    const { username, password, email, fullName } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "User must provide all information" });
    }

    const checkExistingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (checkExistingUser) {
      return res
        .status(400)
        .json({ error: "username or email already exist in database" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        username,
        fullName,
        password: hashedPassword,
        email,
      });

      newUser.password = null;
      generateTokenAndSetTokens(newUser._id, res);
      return res.status(201).json(newUser);
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username: username })
        if (!user) {
            return res.status(404).json({error: "No user Found"})
        }
        const verifyPassword = await bcrypt.compare(password, user.password)
        if (!verifyPassword) {
            return res.status(400).json({error: "Password is not correct"})
        }

        user.password = null
        generateTokenAndSetTokens(user._id, res)
        return res.status(200).json({message: "Logged In successfully", user})
        
    } catch (error) {
        next(error)
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        return res.status(200).json({message: "successfully logged out!!!"})
    } catch (error) {
        next(error)
    }
}

export const getUserProfile = async (req, res, next) => {
    try {
        const user = req.user
        user.password = null

        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}
