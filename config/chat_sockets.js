module.exports.chatSockets = function (socketServer) {
  let io = require("socket.io")(socketServer, {
    cors: {
      origin: "http://localhost:8000",
      methods: ["GET", "POST"],
    },
  });

  io.sockets.on("connection", function (socket) {
    console.log("new connection recieved", socket.id);

    socket.on("disconnect", function () {
      console.log("socket disconnected");
    });

    socket.on("join_room", function (data) {
      console.log("Joining request recieved...", data);

      socket.join(data.chatroom);

      io.in(data.chatroom).emit("user_joined", data);
    });

    // detect send_message and broadcast to everyone in the room
    socket.on("send_message", function (data) {
      io.in(data.chatroom).emit("receive_message", data);
    });
  });
};
