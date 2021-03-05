import React from "react";
import { Container, Jumbotron, Button } from "react-bootstrap";

function ChooseRole() {
  return (
    <Jumbotron>
      <h1 className="text-center">
        <span className="font-weight-bold">What are you registering as?</span>
      </h1>
      <Container>
        <Button href="/users/teachers/register">I'm Staff</Button>
      </Container>
      <Container>
        <Button href="/users/students/register">I'm a Student</Button>
      </Container>
    </Jumbotron>
  );
}

export default ChooseRole;
