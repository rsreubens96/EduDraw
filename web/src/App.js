import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./NavbarComponent";
import RegisterTeacher from "./Register/RegisterTeacher";
import RegisterStudent from "./Register/RegisterStudent";
import Home from "./Home/Home";
import ChooseRole from "./Register/ChooseRole";
import LoginStudent from "./Login/LoginStudent";
import LoginStaff from "./Login/LoginStaff";
import Profile from "./Profile/Profile";
import RoomMain from "./Room/RoomMain";
import CreateRoom from "./Room/CreateRoomForm";
import Classroom from "./Classroom/Classroom";
import jwt from "jwt-decode";
import axios from "axios";

export default function App() {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token === null || token === "undefined" || typeof token != "string") {
      return;
    }
    console.log(jwt(token));
    console.log(token);
    axios
      .get("http://localhost:4000/myself", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setUserInfo({
            firstName:
              res.data.firstname.charAt(0).toUpperCase() +
              res.data.firstname.slice(1),
            lastName:
              res.data.lastname.charAt(0).toUpperCase() +
              res.data.lastname.slice(1),
            email: res.data.email,
            role: jwt(token).user.role,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {});
  }, []);

  return (
    <div className="App">
      <Navbar></Navbar>
      <Router>
        <div>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route exact path="/register/staff">
              <RegisterTeacher />
            </Route>
            <Route exact path="/register/student">
              <RegisterStudent />
            </Route>
            <Route exact path="/authenticate/student">
              <LoginStudent />
            </Route>
            <Route exact path="/authenticate/staff">
              <LoginStaff />
            </Route>
            <Route exact path="/register">
              <ChooseRole />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/profile">
              <Profile />
            </Route>
            <Route exact path="/rooms">
              <RoomMain />
            </Route>
            <Route exact path="/rooms/create-room">
              <CreateRoom />
            </Route>
            <Route exact path="/rooms/test">
              <Classroom />
            </Route>
            <Route exact path="/rooms/:roomId">
              <Classroom user={userInfo} />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}
