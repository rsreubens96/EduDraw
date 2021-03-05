import React from "react";
import { Jumbotron, Button } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <Jumbotron>
        <h1>Welcome to EduDraw!</h1>
        <p>
          This is a simple hero unit, a simple jumbotron-style component for
          calling extra attention to featured content or information.
        </p>
        <p>
          <Link to="/users">
            <Button variant="primary">Register now!</Button>
          </Link>
        </p>
      </Jumbotron>
    </div>
  );
}

export default Home;
