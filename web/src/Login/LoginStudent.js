import React from "react";
import LoginForm from "./LoginForm";
import { Container } from "react-bootstrap";

export default function LoginStudent() {
  return (
    <div>
      <Container>
        <h1 className="text-center">
          <span className="font-weight-bold">EduDraw</span>
        </h1>
        <h2 className="text-center">Student Login</h2>
        <LoginForm isStudent={true}></LoginForm>
      </Container>
    </div>
  );
}
