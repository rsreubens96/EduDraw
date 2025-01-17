import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Form, InputGroup, FormControl } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import { v4 as uuidv4, v4 } from "uuid";

const CreateRoomForm = (props) => {
  const history = useHistory();
  const [createFailed, setCreateFailed] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    roomName: "",
    roomDescription: "",
    // roomPassword: "",
  });

  useEffect(() => {
    if (props.user.role === undefined) {
      return;
    }
    if (props.user.role !== "Staff") {
      history.push("/unauthorized");
      history.go();
    }
  }, [props.user]);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setData((data) => ({
      ...data,
      [id]: value,
    }));
    console.log(data);
  };

  const HasCreateFailed = () => {
    if (!createFailed) {
      return <div />;
    }
    return <p className="text-danger text-center">{error}</p>;
  };

  const validateFields = () => {
    let errors = [];
    if (data.roomName === "") {
      errors.push("Room name cannot be empty");
    }
    if (data.roomDescription === "") {
      errors.push(" Room description cannot be empty");
    }

    if (errors.length > 0) {
      setError(errors.toString());
      return false;
    }
    return true;
  };

  const handleCreate = (e) => {
    if (!validateFields()) {
      setCreateFailed(true);
      return;
    }
    let roomId = v4();
    axios
      .post("http://localhost:4000/rooms/create-room", {
        roomUUID: roomId,
        roomName: data.roomName,
        roomDescription: data.roomDescription,
        // roomPassword: data.roomPassword,
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          if (response.data.error) {
            setCreateFailed(true);
            setError(response.data.error);
            return;
          }
          return history.push({
            pathname: `/rooms/${roomId}`,
            state: {
              roomId: roomId,
              roomName: data.roomName,
              roomDescription: data.roomDescription,
            },
          });
        } else {
          setCreateFailed(false);
        }
      })
      .catch((error) => {
        setCreateFailed(true);
        console.log(error);
      });
  };

  return (
    <Container>
      <div className="card text-center">
        <HasCreateFailed />
        <Form className="login-form">
          <Form.Group>
            <Form.Label>Room Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter room name"
              id="roomName"
              defaultValue={data.roomName}
              onChange={handleChange}
            />
            <Form.Label>Room Description</Form.Label>
            <FormControl
              as="textarea"
              placeholder="What's the room going to be about?"
              id="roomDescription"
              defaultValue={data.roomDescription}
              onChange={handleChange}
            />
          </Form.Group>

          {/* <Form.Group>
          <Form.Label>Room Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            id="roomPassword"
            defaultValue={data.roomPassword}
            onChange={handleChange}
          />
        </Form.Group> */}

          <Button variant="primary" type="button" onClick={handleCreate}>
            Create
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default CreateRoomForm;
