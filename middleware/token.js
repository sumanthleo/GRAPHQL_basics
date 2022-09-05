const jwt = require("jsonwebtoken");
//apply middleware to verify token
module.exports = (req, res, next) => {
  //add token to header
  const authHeader = req.headers.token;
  //check if token is not provided
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    //verify token
    jwt.verify(token, "sumanth", (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};
