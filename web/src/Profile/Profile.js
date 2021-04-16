import React, { useEffect, useState } from "react";
import jwt from "jwt-decode";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import _ from "lodash";
import "./Profile.css";
import { Container, Row, Col, Button } from "react-bootstrap";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({});

  const getDetails = () => {
    const token = localStorage.getItem("token");
    if (token === null || token === "undefined" || typeof token != "string") {
      return;
    }
    console.log(jwt(token));
    console.log(token);
    axios
      .get("http://localhost:4000/myself", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setUserInfo({
            firstName:
              res.data.firstname.charAt(0).toUpperCase() +
              res.data.firstname.slice(1),
            lastName:
              res.data.lastname.charAt(0).toUpperCase() +
              res.data.lastname.slice(1),
            email: res.data.email,
            role: jwt(token).user.role,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {});
  };

  useEffect(() => {
    getDetails();
  }, []);

  if (_.isEmpty(userInfo)) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  const name = userInfo.firstName + " " + userInfo.lastName;

  return (
    <Container className="text-center">
      <div className="card">
        <h1 className="display-1">{name}</h1>
        <img
          src="user-solid.svg"
          alt={name}
          style={{ height: "200px", width: "100%" }}
        />
        <Container style={{ padding: "20px" }}>
          <Button>Upload a picture</Button>
          <Row>
            <Col>
              <b>Full Name</b>
            </Col>
            <Col>{name}</Col>
          </Row>
          <Row>
            <Col>
              <b>Role</b>
            </Col>
            <Col>{userInfo.role}</Col>
          </Row>
          <Row>
            <Col>
              <b>Age</b>
            </Col>
            <Col>{name}</Col>
          </Row>
        </Container>
      </div>

      <Button>Edit Profile</Button>
    </Container>
  );
};

export default Profile;
