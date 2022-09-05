const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const user = require("../../models/users");

module.exports = {
  /**
   * @apiName user signup
   * @apiParam {String} signup with user name and email address and password
   * @apiParam {String}  encrypt passowrd with bcrypt package
   * @apiParam {String}  signup
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "message": "Signup Success",
   * }
   */

  createUser: async (args) => {
    try {
      const existingUser = await user.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const users = new user({
        username: args.userInput.username,
        email: args.userInput.email,
        password: hashedPassword,
      });

      const result = await users.save();

      return { ...result._doc, password: null };
    } catch (error) {
      res.status(500).json({
        status: 500,
        message:
          typeof error === "string"
            ? error
            : typeof error.message === "string"
            ? error.message
            : "Something went wrong",
      });
    }
  },

  /**
   * @apiName user signin
   * @apiParam {String} signin with email  address and password
   * @apiParam {String}  compare encrypt passowrd with user password
   * @apiParam {String}  signin
   * @apiSuccessExample {json} Success-Response:
   * {}
   */

  login: async ({ email, password }) => {
    try {
      const user = await user.findOne({ email: email });
      if (!user) {
        throw new Error("User does not exist!");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Password is incorrect!");
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "sumanth",
        {
          expiresIn: "1h",
        }
      );
      return { data: user, token: token };
    } catch (error) {
      res.status(500).json({
        status: 500,
        message:
          typeof error === "string"
            ? error
            : typeof error.message === "string"
            ? error.message
            : "Something went wrong",
      });
    }
  },
};
