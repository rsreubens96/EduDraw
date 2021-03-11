import React from "react";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import jwt from "jwt-decode";

const LoginForm = (props) => {
  const history = useHistory();
  const [loginFailed, setLoginFailed] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setData((data) => ({
      ...data,
      [id]: value,
    }));
    console.log(data);
  };

  const HasLoginFailed = () => {
    if (!loginFailed) {
      return <div />;
    }
    return (
      <p className="text-danger text-center">
        The email and password that you entered did not match our records.
        Please double-check and try again.
      </p>
    );
  };

  const handleLogin = (e) => {
    if (props.isStudent === null) {
      return;
    }
    const url = props.isStudent
      ? "/authenticate/student"
      : "/authenticate/staff";
    axios
      .post("http://localhost:4000" + url, {
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          const token = response.data.token;
          localStorage.setItem("token", token);
          window.location.reload();
        }
      })
      .catch((error) => {
        setLoginFailed(true);
        console.log(error);
      });
  };

  return (
    <Container>
      <HasLoginFailed />
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
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default LoginForm;
