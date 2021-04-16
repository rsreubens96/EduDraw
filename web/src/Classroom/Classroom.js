import React, { useEffect } from "react";
import Whiteboard from "../Whiteboard/Whiteboard";
import { useLocation, useHistory } from "react-router-dom";
import VideoList from "../VideoList/VideoList";
import { Container, Jumbotron } from "react-bootstrap";
import "./Classroom.css";
const io = require("socket.io-client");

const Classroom = (props) => {
  const socket = io("http://localhost:4000");
  const location = useLocation();
  const history = useHistory();
  if (location.state === undefined) {
    history.push("/rooms/");
    return null;
  }
  const roomId = location.state.roomId;
  console.log(location.state);
  // console.log(location.state.detail); // result: 'some_value'

  return (
    <div>
      <Jumbotron>
        <h1 className="display-4 text-center">Class Name</h1>
      </Jumbotron>
      <Container>
        <div style={{ height: "1000px" }}>
          <div style={{ display: "inline-block" }}>
            <Whiteboard socket={socket} roomId={roomId} />
          </div>
          <div>
            <VideoList socket={socket} roomId={roomId} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Classroom;
