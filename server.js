const express = require("express");
// const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const isAuth = require("./middleware/token");

//database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Connection failed");
  });

//middleware
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

//middleware
app.use(isAuth);
//routes

// app.use(
//   '/graphql',
//   graphqlHttp({
//     schema: graphQlSchema,
//     rootValue: graphQlResolvers,
//     graphiql: true
//   })
// );

//server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is connected ${port}`);
});
