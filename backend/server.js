import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

const server = http.createServer(app);
//create a socket.io server
const io = new Server(server, {
  pingTimeOut: 60000,
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

//handle incoming connections
io.on("connection", (socket) => {
  console.log("connected");
  //it creates a room (setup) for the user to enter that room
  // socket.on("setup", (userData) => {
  //   socket.join(userData._id);
  //   console.log(userData._id);
  //   socket.emit("connected");
  // });
});

dotenv.config();
connectDB();

//some middlewares to tell the server for accepting JSON data from frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(
  process.env.PORT || 5000,
  console.log(
    `App is listening on http://localhost:${process.env.PORT}`.yellow.bold
  )
);

// const io = new WebSocketServer({ server });

// io(server, {
//   pingTimeOut: 60000,
//   cors: {
//     origin: "http://localhost:5000",
//   },
// });
