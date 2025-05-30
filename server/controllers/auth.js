import * as config from "../config.js";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";
import validator from "email-validator";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import Ad from "../models/ad.js";
import Testimonial from "../models/testimonials.js";

const tokenAndUserResponse = (req, res, user) => {
  const token = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign({ _id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  user.password = undefined;
  user.resetCode = undefined;

  return res.json({
    token,
    refreshToken,
    user,
  });
};

export const welcome = (req, res) => {
  res.json({
    data: "hello from nodejs api from routes yay",
  });
};

export const preRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!validator.validate(email)) {
      return res.json({ error: "Въведете валиден имейл" });
    }
    if (!password) {
      return res.json({ error: "Въведете парола" });
    }
    if (password && password?.length < 6) {
      return res.json({ error: "Паролата трябва да съдържа поне 6 символа" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.json({ error: "Имейлът е зает" });
    }

    const token = jwt.sign({ email: email.toLowerCase(), password }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Log the CLIENT_URL to confirm it's correct
    console.log("CLIENT_URL in preRegister:", config.CLIENT_URL);

    // Email content
    const emailParams = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Data: `
              <p>Моля отворете линка за да активирате акаунта си.</p>
              <a href="${config.CLIENT_URL}/auth/account-activate/${token}">Активирай акаунт</a>
            `,
          },
        },
        Subject: {
          Data: "Активирайте акаунта си в Havenly",
        },
      },
      Source: config.EMAIL_FROM,
      ReplyToAddresses: [config.REPLY_TO],
    };

    // Send email using AWS SES
    const sendEmailCommand = new SendEmailCommand(emailParams);
    try {
      const data = await config.AWSSES.send(sendEmailCommand);
      console.log("Email sent successfully:", data);
      return res.json({ ok: true });
    } catch (err) {
      console.error("Error sending email:", err);
      return res.json({ ok: false, error: "Нещо се обърка. Опитайте отново." });
    }
  } catch (err) {
    console.log(err);
    return res.json({ error: "Нещо се обърка. Опитайте отново." });
  }
};

export const register = async (req, res) => {
  try {
    console.log("Register token:", req.body.token);
    const { email, password } = jwt.verify(req.body.token, config.JWT_SECRET);
    console.log("Register email:", email);

    const userExist = await User.findOne({ email: email.toLowerCase() });
    if (userExist) {
      console.log("User already exists:", email);
      return res.json({ error: "Имейлът е зает" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await new User({
      username: nanoid(6),
      email: email.toLowerCase(),
      password: hashedPassword,
    }).save();
    console.log("User registered:", user);

    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log("Register error:", err);
    return res.json({ error: "Нещо се обърка. Опитайте отново." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({
        error: "Не беше намерен такъв потребител. Моля направете регистрация.",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({ error: "Грешна парола." });
    }

    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.json({ error: "Нещо се обърка. Опитайте отново." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "Не намерихме потребител с този имейл" });
    }

    // Generate a reset code and save it to the user record
    const resetCode = nanoid();
    user.resetCode = resetCode;
    await user.save();

    // Create a token with the reset code
    const token = jwt.sign({ resetCode }, config.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Email parameters
    const emailParams = {
      Source: config.REPLY_TO,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Влизане в Havenly",
        },
        Body: {
          Html: {
            Data: `
              <p>Моля отворете линка отдолу за да влезете в акаунта си.</p>
              <a href="${config.CLIENT_URL}/auth/access-account/${token}">Влез в акаунт</a>
            `,
          },
        },
      },
    };

    // Create and send the email using AWS SES
    try {
      const sendEmailCommand = new SendEmailCommand(emailParams);
      const data = await config.AWSSES.send(sendEmailCommand);
      console.log("Email sent successfully:", data);
      return res.json({ ok: true });
    } catch (err) {
      console.error("Error sending email:", err);
      return res.json({ ok: false, error: "Нещо се обърка. Опитайте отново." });
    }
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    return res.json({ error: "Нещо се обърка. Опитайте отново." });
  }
};

export const accessAccount = async (req, res) => {
  try {
    const { resetCode } = jwt.verify(req.body.resetCode, config.JWT_SECRET);

    const user = await User.findOneAndUpdate({ resetCode }, { resetCode: "" });

    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.json({ error: "Нещо се обърка. Опитайте отново." });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { _id } = jwt.verify(req.headers.refresh_token, config.JWT_SECRET);

    const user = await User.findById(_id);

    tokenAndUserResponse(req, res, user);
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Refresh token failed" });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Unauthorized" });
  }
};

export const publicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.json({ error: "Потребителят не беше намерен" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.json({ error: "Въведете парола" });
    }
    if (password && password?.length < 6) {
      return res.json({ error: "Паролата трябва да съдържа повече от 6 символа" });
    }

    const user = await User.findByIdAndUpdate(req.user._id, {
      password: await hashPassword(password),
    });

    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Unauthorized" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    user.password = undefined;
    user.resetCode = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    if (err.codeName === "DuplicateKey") {
      return res.json({ error: "Наименованието или имейлът са вече заети" });
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
  }
};

export const agents = async (req, res) => {
  try {
    const agents = await User.find({ role: "Seller" }).select(
      "-password -role -enquiredProperties -wishlist"
    );
    res.json(agents);
  } catch (err) {
    console.log(err);
  }
};

export const agentAdCount = async (req, res) => {
  try {
    const ads = await Ad.find({ postedBy: req.params._id }).select("_id");
    res.json(ads);
  } catch (err) {
    console.log(err);
  }
};

export const agent = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -role -enquiredProperties -wishlist"
    );
    const ads = await Ad.find({ postedBy: user._id }).select(
      "-location -googleMap"
    );
    res.json({ user, ads });
  } catch (err) {
    console.log(err);
  }
};

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .populate("user", "username name")
      .sort({ date: -1 });
    res.json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const addTestimonial = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }
    const user = await User.findById(req.user._id).select("username name");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const testimonial = new Testimonial({
      user: user._id,
      username: user.name || user.username || "Анонимен", 
      text,
    });
    await testimonial.save();
    const populatedTestimonial = await Testimonial.findById(testimonial._id).populate("user", "username name");
    res.status(201).json(populatedTestimonial);
  } catch (error) {
    console.error("Error posting testimonial:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    console.log("Deleting testimonial with ID:", req.params.id);
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      console.log("Testimonial not found for ID:", req.params.id);
      return res.status(404).json({ error: "Отзивът не е намерен" });
    }
    console.log("Current user ID:", req.user._id, "Testimonial user ID:", testimonial.user.toString());
    if (testimonial.user.toString() !== req.user._id) {
      console.log("Unauthorized attempt to delete testimonial");
      return res.status(403).json({ error: "Нямате права да изтриете този отзив" });
    }
    await Testimonial.deleteOne({ _id: req.params.id });
    console.log("Testimonial deleted successfully");
    res.json({ message: "Отзивът е изтрит успешно" });
  } catch (error) {
    console.error("Error deleting testimonial:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};