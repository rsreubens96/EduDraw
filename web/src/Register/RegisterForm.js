import React from "react";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";

const RegisterForm = (props) => {
  const [data, setData] = useState({
    forename: "",
    surname: "",
    email: "",
    dob: "",
    password: "",
    hasRegistered: false,
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setData((data) => ({
      ...data,
      [id]: value,
    }));
    console.log(data);
  };

  const handleSubmit = (e) => {
    if (props.isStudent) {
    }
    setData((data) => ({
      ...data,
      hasRegistered: true,
    }));
    const url = props.isStudent
      ? "/users/students/register"
      : "users/teachers/register";
    axios
      .post("http://localhost:4000" + url, {
        firstName: data.forename,
        lastName: data.surname,
        email: data.email,
        dateOfBirth: data.dob,
        password: data.password,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setData((data) => ({
            ...data,
            hasRegistered: true,
          }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const HasRegistered = () => {
    console.log(data.hasRegistered);
    if (data.hasRegistered === true) {
      console.log("I AM HERE");
      return <div className="text-success">Registration successful!</div>;
    }
    return <div></div>;
  };

  return (
    <Container>
      <Form className="login-form">
        {/* <h1 className="text-center">
        <span className="font-weight-bold">EduDraw</span>
      </h1>
      <h2 className="text-center">Register as a student</h2> */}
        <Form.Group>
          <Form.Label>Forename</Form.Label>
          <Form.Control
            type="text"
            placeholder="Forename"
            id="forename"
            defaultValue={data.forename}
            onChange={handleChange}
          ></Form.Control>

          <Form.Label>Surname</Form.Label>
          <Form.Control
            type="text"
            id="surname"
            placeholder="Surname"
            defaultValue={data.surname}
            onChange={handleChange}
          ></Form.Control>

          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            id="email"
            defaultValue={data.email}
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Label>Date of Birth</Form.Label>
        <Form.Control
          type="date"
          name="dob"
          placeholder="Date of Birth"
          id="dob"
          defaultValue={data.dob}
          onChange={handleChange}
        />

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

        <Button
          variant="primary"
          type="button"
          onClick={handleSubmit}
          disabled={data.hasRegistered}
        >
          Register
        </Button>

        <HasRegistered></HasRegistered>
        {/* <div className="text-success">Account created successfully.</div> */}
      </Form>
    </Container>
  );
};

export default RegisterForm;
