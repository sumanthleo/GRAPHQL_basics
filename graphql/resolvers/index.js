const users = require("./user");

const rootResolver = {
  ...users,
};

module.exports = rootResolver;
