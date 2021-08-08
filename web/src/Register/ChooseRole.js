import React from "react";
import { Container, Jumbotron, Button } from "react-bootstrap";
import "./ChooseRole.css";

function ChooseRole() {
  return (
    <div>
      <Jumbotron>
        <h1 className="text-center">
          <span className="display-4">What are you registering as?</span>
        </h1>
      </Jumbotron>
      <div style={{ textAlign: "center" }} className="centered">
        <div style={{ display: "inline-block", paddingTop: "40%" }}>
          <Button
            variant="outline-primary"
            size="lg"
            style={{ margin: "20px" }}
            href="/register/staff"
            block
          >
            Staff
          </Button>
          <Button
            variant="outline-primary"
            size="lg"
            style={{ margin: "20px" }}
            href="/register/student"
            block
          >
            Student
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChooseRole;
