const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.port || 4000;

io.on("connection", (socket) => {
  console.log("User has connected");
  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });

  socket.on("test", () => {
    console.log("test");
  });
});

http.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
