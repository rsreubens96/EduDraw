import React from "react";
import Register from "./RegisterForm";
import { Container } from "react-bootstrap";

function RegisterStudent() {
  return (
    <Container>
      <h1 className="text-center">
        <span className="font-weight-bold">EduDraw</span>
      </h1>
      <h2 className="text-center">Register as a student</h2>
      <Register isStudent={true}></Register>
    </Container>
  );
}

export default RegisterStudent;
