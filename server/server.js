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

let rooms = {};

io.on("connection", (socket) => {
  let socketRoomID = "";
  socket.on("hello", (data) => {
    console.log(data);
    socket.join(data.roomID);
    socketRoomID = data.roomID;

    let user = {
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      socketID: socket.id,
    };

    // console.log(rooms[data.roomID].[data.socketID]);
    if (!rooms[data.roomID]) {
      rooms[data.roomID] = {};
    }
    rooms[data.roomID][socket.id] = user;
    // console.log(rooms[data.roomID]["asdasdasd"]);
    console.log("ASDHOUSDH");
    io.in(data.roomID).clients((client) => {
      console.log(client);
    });
  });

  socket.on("drawing", (data) => {
    io.to(socketRoomID).emit("drawing", data);
  });

  socket.on("clear", () => {
    io.in(socketRoomID).clients((err, clients) => {
      console.log(clients);
    });
    io.to(socketRoomID).emit("clear");
  });

  socket.on("erasing", (data) => {
    io.to(socketRoomID).emit("erasing", data);
  });

  socket.on("toggleDrawingPrivileges", (data) => {
    io.to(data.peerID).emit("toggleDrawingPrivileges", data.value);
  });

  // WebRTC stuff
  socket.on("getAllClients", (data) => {
    // console.log("GET ALL CLINETS");
    io.in(socketRoomID).clients((err, clients) => {
      const dataToSend = [];
      clients.forEach((client) => {
        // console.log(rooms[socketRoomID][client]);
        dataToSend.push(rooms[socketRoomID][client]);
      });
      // console.log("DATA TO SEND IS");
      // console.log(dataToSend);
      if (clients.length > 0) {
        io.to(socketRoomID).emit("receiveClients", dataToSend);
      }
    });
  });

  socket.on("signalToClient", (data) => {
    // socket.to(data.roomId).emit("signal", data);
    console.log(socket.id + " is sending a signal to " + data.receiverID);
    io.to(data.receiverID).emit("userJoined", {
      signal: data.signal,
      callerID: data.callerID,
      firstName: rooms[socketRoomID][data.callerID].firstName,
      lastName: rooms[socketRoomID][data.callerID].lastName,
      role: rooms[socketRoomID][data.callerID].role,
    });
  });

  socket.on("returningSignal", (data) => {
    console.log(socket.id + " is returning their signal to " + data.callerID);
    io.to(data.callerID).emit("receivingReturnedSignal", {
      signal: data.signal,
      id: socket.id,
    });
  });

  socket.on("disconnecting", (data) => {
    console.log("DISCONNECT");
    console.log(socket.id + " has disconnected");
    if (rooms[socketRoomID]) {
      delete rooms[socketRoomID][socket.id];
    }
    io.in(socketRoomID).clients((err, clients) => {
      const dataToSend = [];
      clients.forEach((client) => {
        console.log(client);
        if (rooms[socketRoomID][client] !== undefined) {
          dataToSend.push(rooms[socketRoomID][client]);
        }
      });
      console.log(dataToSend);
      // console.log("DATA TO SEND IS");
      // console.log(dataToSend);
      if (clients.length > 0) {
        io.to(socketRoomID).emit("receiveClients", dataToSend);
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
  //Extract the room details from the request body
  const { roomUUID, roomName, roomDescription } = req.body;
  pool.query(
    //SQL query to check if the room already exists in the Rooms table
    `SELECT * FROM Rooms WHERE roomname = $1`,
    [roomName],
    async (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.rows.length > 0) {
        //If the room already exists, send back an error to the frontend so they can display it and try again
        return res.status(200).send({
          error:
            "A room with that name already exists. Please select a new room name.",
        });
      } else {
        //If the room does not exist, insert it into the table and return a 200 ok.
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
          return res.status(200).send(results.rows[0]);
        }
        return res.status(200).send({
          error: "A room with that ID does not exist. Please try again.",
        });
      }
    );
  });
});
