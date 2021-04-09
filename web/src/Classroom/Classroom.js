import React, { useEffect } from "react";
import Whiteboard from "../Whiteboard/Whiteboard";
import { useLocation, useHistory } from "react-router-dom";
import VideoList from "../VideoList/VideoList";
import { Container } from "react-bootstrap";
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
    <div style={{ position: "fixed" }}>
      <div style={{ display: "inline-block" }}>
        <Whiteboard socket={socket} roomId={roomId} />
      </div>
      <div style={{ marginLeft: "100px", display: "inline-block" }}>
        <VideoList socket={socket} roomId={roomId} />
      </div>
    </div>
  );
};

export default Classroom;
