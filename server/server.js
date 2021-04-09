const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const StudentLoginStrategy = require("./Passport/StudentLoginStrategy");
const StaffLoginStrategy = require("./Passport/StaffLoginStrategy");

const jwt = require("jsonwebtoken");
const config = require("dotenv").config().parsed;

const { pool } = require("./config/dbConfig");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

passport.use("login-student", StudentLoginStrategy);
passport.use("login-staff", StaffLoginStrategy);
app.use(cors());
// app.use(passport.session());
const PORT = process.env.port || 4000;

io.on("connection", (socket) => {
  let socketRoomID = "";
  socket.on("hello", (roomID) => {
    socket.join(roomID);
    socketRoomID = roomID;
  });

  socket.on("drawing", (data) => {
    io.to(socketRoomID).emit("drawing", data);
  });

  socket.on("erasing", (data) => {
    io.to(socketRoomID).emit("erasing", data);
  });

  // WebRTC stuff

  socket.on("getAllClients", (data) => {
    io.in(socketRoomID).clients((err, clients) => {
      console.log(socket.id);
      console.log(clients);
      if (clients.length > 0) {
        io.to(socketRoomID).emit("receiveClients", clients);
      }
    });
  });

  socket.on("signalToClient", (data) => {
    // socket.to(data.roomId).emit("signal", data);
    console.log(socket.id + " is sending a signal to " + data.receiverID);
    io.to(data.receiverID).emit("userJoined", {
      signal: data.signal,
      callerID: data.callerID,
    });
  });

  socket.on("returningSignal", (data) => {
    console.log(socket.id + " is returning their signal to " + data.callerID);
    io.to(data.callerID).emit("receivingReturnedSignal", {
      signal: data.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", (data) => {
    console.log(socket.id + " has disconnected");
    io.in(socketRoomID).clients((err, clients) => {
      if (clients.length > 0) {
        io.to(socketRoomID).emit("receiveClients", clients);
      }
    });
  });
});

http.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const users = require("./users/users");
app.use(users);

app.post("/rooms/create-room/", (req, res, next) => {
  const { roomUUID, roomName, roomDescription } = req.body;
  console.log(req.body);
  pool.query(
    `SELECT * FROM Rooms WHERE roomname = $1`,
    [roomName],
    async (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.rows.length > 0) {
        return res.status(200).send({
          error:
            "A room with that name already exists. Please select a new room name.",
        });
      } else {
        pool.query(
          `INSERT INTO Rooms (roomuuid, roomname, roomdescription)
      VALUES ($1, $2, $3)`,
          [roomUUID, roomName, roomDescription],
          (err, results) => {
            if (err) {
              return res
                .status(500)
                .send({ error: "Oops, something went wrong." });
            }
            return res.sendStatus(200);
          }
        );
      }
    }
  );
});

app.get("/rooms/:roomId", (req, res, next) => {
  let roomId = req.params.roomId;
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
    // Check for incorrect JWT
    if (err) {
      return res.status(401).send({ error: "JWT signature does not match" });
    }

    // Check if room id is in database
    pool.query(
      `SELECT * From Rooms WHERE roomuuid = $1`,
      [roomId],
      async (err, results) => {
        if (err) {
          return res.status(500).send({ error: "Oops, something went wrong." });
        }
        if (results.rows.length > 0) {
          return res.status(200).send();
        }
        return res.status(200).send({
          error: "A room with that ID does not exist. Please try again.",
        });
      }
    );
  });
});
