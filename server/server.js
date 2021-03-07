const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const StudentLoginStrategy = require("./Passport/StudentLoginStrategy");
const StaffLoginStrategy = require("./Passport/StaffLoginStrategy");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "To infinity and beyond!",
    saveUninitialized: false,
    resave: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
passport.use("login-student", StudentLoginStrategy);
passport.use("login-staff", StaffLoginStrategy);
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

const users = require("./users/users");
app.use(users);
