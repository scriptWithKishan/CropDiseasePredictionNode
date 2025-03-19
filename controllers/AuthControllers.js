const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/******  User Model  ******/
const UserModel = require("../models/UserModel");

/******  Promisified jwt Functions  ******/
const promisify = require("util").promisify;
const promisifiedJWTSign = promisify(jwt.sign);

/******  JWT Secret  ******/
const { JWT_SECRET } = process.env;

/******  Auth Handlers  ******/
const createUserHandler = async function (req, res) {
  try {
    const userObject = req.body;

    // Checking if the password and confirm password are the same
    if (userObject.password === userObject.confirmPassword) {
      // Hashing the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userObject.password, saltRounds);

      // Replacing the plain password with the hashed password
      userObject.password = hashedPassword;

      // Creating New user and pushing it to the database
      let newUser = await UserModel.create(userObject);

      // Sending Success Response
      res.status(201).json({
        status: "success",
        message: "User created successfully",
        newUser,
      });
    } else {
      // Sending Failure Response for unmatched passwords
      res.status(400).json({
        status: "failure",
        message: "Password and Confirm Password must be the same",
      });
    }
  } catch (err) {
    // Sending Failure Response
    res.status(500).json({
      status: "failure",
      message: "Internal Server Error, Couldn't create user",
      errMsg: err.message,
    });
  }
};

const loginUserHandler = async function (req, res) {
  try {
    const { email, password } = req.body;

    // Finding the user with the email
    const user = await UserModel.findOne({ email });

    // Checking if the user exists
    if (user) {
      const areMatch = await bcrypt.compare(password, user.password);
      // Checking if the password matches
      if (areMatch) {
        let token = await promisifiedJWTSign({ id: user["_id"] }, JWT_SECRET);
        res.status(200).json({
          status: "success",
          message: "User logged in successfully",
          token,
        });
      } else {
        // Sending Failure Response for wrong password
        res.status(401).json({
          status: "failure",
          message: "Invalid Password",
        });
      }
    } else {
      // Sending Failure Response for wrong user
      res.status(401).json({
        status: "failure",
        message: "User not found",
      });
    }
  } catch (err) {
    // Sending Failure Response
    res.status(500).json({
      status: "failure",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createUserHandler,
  loginUserHandler,
};
