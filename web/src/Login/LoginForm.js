import React from "react";
import { Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";

const LoginForm = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [loginFailed, setLoginFailed] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    console.log("STATE");
    if (location.state === undefined) {
      console.log("RETURNING");
      return;
    }
    if (location.state.registered === true) {
      setRegistered(true);
    }
  }, [location]);

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
          history.push("/profile");
          history.go();
        }
      })
      .catch((error) => {
        setLoginFailed(true);
        console.log(error);
      });
  };

  return (
    <Container>
      {registered && (
        <p className="text-center text-success">Successfully registered.</p>
      )}
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
