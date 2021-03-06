import React from "react";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const LoginForm = (props) => {
  const history = useHistory();
  const [data, setData] = useState({
    email: "student@gmail.com",
    password: "password",
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setData((data) => ({
      ...data,
      [id]: value,
    }));
    console.log(data);
  };

  const handleLogin = (e) => {
    const url = "/users/students/login";
    axios
      .post("http://localhost:4000" + url, {
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          history.push("/loggedin");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container>
      <Form className="login-form">
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            id="email"
            defaultValue={data.email}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            id="password"
            defaultValue={data.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="button" onClick={handleLogin}>
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default LoginForm;
