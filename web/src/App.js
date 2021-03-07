import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from "./NavbarComponent";
import RegisterTeacher from "./Register/RegisterTeacher";
import RegisterStudent from "./Register/RegisterStudent";
import { Container } from "react-bootstrap";
import Home from "./Home/Home";
import ChooseRole from "./Register/ChooseRole";
import LoginStudent from "./Login/LoginStudent";
import LoginStaff from "./Login/LoginStaff";
import Loggedin from "./Login/Loggedin";

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
            <Route exact path="/loggedin/">
              <Loggedin />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}
