import React from "react";
import { Jumbotron, Button } from "react-bootstrap";
import "../App.css";

function Home() {
  return (
    <Jumbotron className="text-center">
      .<h1>Welcome to EduDraw!</h1>
      <p>
        EduDraw is an online learning platform that allows you to share a
        collaborative whiteboard with your students in a room.
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
