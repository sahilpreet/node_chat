const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
// const cors = require("cors")

const userRouter = require("./routers/users");
const authRouter = require("./routers/auth");
const postRouter = require("./routers/posts");

const PORT = process.env.PORT || 8800;

//for environmet
dotenv.config();
//to connect mongoose
require("./db/mongoose");

const app = express();
//to get req.body in json format
app.use(express.json());

//middlewares
app.use(morgan("common"));
app.use(helmet());

//for croos site error cors in fetch api
app.use(function (req, res, next) {
  //cors for all websites
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  // res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
// app.use("/posts", postRouter);

app.get("/", (req, res) => {
  res.send("node started");
});

app.listen(PORT);
