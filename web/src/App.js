import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from "./NavbarComponent";
import RegisterTeacher from "./Register/RegisterTeacher";
import RegisterStudent from "./Register/RegisterStudent";
import { Container } from "react-bootstrap";
import Home from "./Home/Home";
import ChooseRole from "./Register/ChooseRole";

export default function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Router>
        <div>
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/users/teachers/register">
              <RegisterTeacher />
            </Route>
            <Route path="/users/students/register">
              <RegisterStudent />
            </Route>
            <Route path="/users/">
              <ChooseRole />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}
