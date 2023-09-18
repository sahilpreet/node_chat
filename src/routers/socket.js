const { Server } = require("socket.io");
const createServer=require("http").createServer

const httpServer = createServer();

const io = new Server(httpServer,{
  cors: {
    origin: "*",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when user connected
  //take socket id and user id
  try {
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
      console.log(users);
    });

    //send and text message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });

    //disconnected socket
    socket.on("disconnect", () => {
      console.log("user disconnected");
      removeUser(socket.id);
      io.emit("getUsers", users);
      console.log(users);
    });
  } catch (error) {
    console.log(error);
  }
});

console.log("socket started at port=8900");
io.listen(process.env.SOCKET_PORT || 8900);
