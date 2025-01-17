import React, { useState } from "react";
import { Form, Container, Button, Row, Col, Jumbotron } from "react-bootstrap";
import "../App.css";
import "./RoomMain.css";
import axios from "axios";
import { useHistory } from "react-router-dom";

const RoomMain = (props) => {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const onChangeHandler = (event) => {
    setRoomId(event.target.value);
  };

  const RenderError = () => {
    if (error === "") {
      return <div />;
    }
    return <p className="text-danger text-center">{error}</p>;
  };

  const handleGo = () => {
    const regex = new RegExp(
      "([a-zA-Z0-9]{8})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{4})-([a-zA-Z0-9]{12})"
    );
    if (!regex.test(roomId)) {
      return setError("The room ID entered is not a valid room ID.");
    }
    const token = localStorage.getItem("token");
    // If user is not logged in
    if (token === null) {
      return;
    }
    axios
      .get(`http://localhost:4000/rooms/${roomId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log("ROOM NAME");
          // If room does not exist
          if (res.data.error) {
            return setError(res.data.error);
          }
          return history.push({
            pathname: `/rooms/${roomId}`,
            state: {
              roomId: roomId,
              roomName: res.data.roomname,
              roomDescription: res.data.roomdescription,
            },
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <Jumbotron>
        <div style={{ textAlign: "center" }}>
          <h1 className="display-4">Rooms</h1>
        </div>
      </Jumbotron>
      <Container>
        <div className="centered">
          <RenderError />
          <div className="input-group">
            <Form.Control
              size="lg"
              type="text"
              placeholder="Room ID"
              onChange={onChangeHandler}
              defaultValue={roomId}
            />
            <Button className="btn-default" onClick={handleGo}>
              Go!
            </Button>
          </div>
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            {props.user.role === "Staff" && (
              <Button className="btn-lg" href="/rooms/create-room">
                Create Room
              </Button>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RoomMain;
