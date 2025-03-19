const { get } = require("mongoose");
const UserModel = require("../models/UserModel");

/******  Utility Functions  ******/
const { getByIdFactory } = require("../utility/crudFactory");

/******  User Handlers  ******/
const getUserByIdHandler = getByIdFactory(UserModel);

module.exports = {
  getUserByIdHandler,
};
