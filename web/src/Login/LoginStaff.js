import React from "react";
import LoginForm from "./LoginForm";
import { Container } from "react-bootstrap";

export default function LoginStaff() {
  return (
    <div>
      <Container>
        <h1 className="text-center">
          <span className="font-weight-bold">EduDraw</span>
        </h1>
        <h2 className="text-center">Staff Login</h2>
        <LoginForm isStudent={false}></LoginForm>
      </Container>
    </div>
  );
}
