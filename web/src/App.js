import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./NavbarComponent";
import RegisterTeacher from "./Register/RegisterTeacher";
import RegisterStudent from "./Register/RegisterStudent";
import Home from "./Home/Home";
import ChooseRole from "./Register/ChooseRole";
import LoginStudent from "./Login/LoginStudent";
import LoginStaff from "./Login/LoginStaff";
import Loggedin from "./Login/Loggedin";
import Profile from "./Profile/Profile";
import RoomMain from "./Room/RoomMain";
import CreateRoom from "./Room/CreateRoomForm";
import Classroom from "./Classroom/Classroom";

export default function App() {
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
            <Router forceRefresh={true} exact path="/loggedin/">
              <Loggedin />
            </Router>
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
              <Classroom />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}
