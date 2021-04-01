import React from "react";
import { Jumbotron, Button } from "react-bootstrap";
import "../App.css";

function Home() {
  return (
    <Jumbotron>
      .<h1>Welcome to EduDraw!</h1>
      <p>
        This is a simple hero unit, a simple jumbotron-style component for
        calling extra attention to featured content or information.
      </p>
      <p>
        <Button variant="primary" href="/register/">
          Register now!
        </Button>
      </p>
    </Jumbotron>
  );
}

export default Home;
