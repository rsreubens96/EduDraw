import React from "react";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const RegisterForm = (props) => {
  const [data, setData] = useState({
    forename: "",
    surname: "",
    email: "",
    dob: "",
    password: "",
  });
  const [registered, setRegistered] = useState(false);
  const history = useHistory();
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { id, value } = event.target;
    setData((data) => ({
      ...data,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    //If there are errors do not submit
    if (!validateFields()) {
      return;
    }
    const url = props.isStudent ? "/register/student" : "/register/staff";
    axios
      .post("http://localhost:4000" + url, {
        firstName: data.forename,
        lastName: data.surname,
        email: data.email,
        dateOfBirth: data.dob,
        password: data.password,
      })
      .then((response) => {
        //If the backend has sent an error with the response, display it on the screen
        if (response.data.error) {
          return setError(response.data.error);
        }
        //If the response status is 200 then the POST was successful.
        if (response.status === 200) {
          setRegistered(true);
          const url = props.isStudent
            ? "/authenticate/student"
            : "/authenticate/staff";
          //Redirect the page to the relevant URL based on if it is a student or staff
          history.push({
            pathname: url,
            state: { registered: true },
          });
          return history.go();
        }
      })
      .catch((error) => {
        // any errors if they exist
        console.log(error);
      });
  };

  const HasRegistered = () => {
    console.log(data.hasRegistered);
    if (registered) {
      return <div className="text-success">Registration successful!</div>;
    }
    return <div></div>;
  };

  const HandleError = () => {
    if (error.length > 0) {
      return <p className="text-danger text-center">{error}</p>;
    }
    return null;
  };

  const validateFields = () => {
    let errors = [];
    if (data.forename === "") {
      errors.push("Forename cannot be empty");
    }
    if (data.surname === "") {
      errors.push(" Surname cannot be empty");
    }
    if (data.email === "") {
      errors.push(" Email cannot be empty");
    }
    if (
      !new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$").test(
        data.email
      )
    ) {
      errors.push(" Please enter a valid email.");
    }
    if (data.dob === "") {
      errors.push(" Date of birth cannot be empty");
    }
    if (data.password === "") {
      errors.push(" Password cannot be empty");
    }
    if (data.password.length < 6) {
      errors.push(" Password must be greater than 5 characters");
    }

    if (errors.length > 0) {
      setError(errors.toString());
      return false;
    }
    return true;
  };

  return (
    <Container>
      <Form className="login-form">
        <HandleError></HandleError>
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
