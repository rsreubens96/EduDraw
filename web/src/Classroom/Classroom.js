import React, { useEffect, useRef, useState } from "react";
import Whiteboard from "../Whiteboard/Whiteboard";
import { useLocation, useHistory } from "react-router-dom";
import VideoList from "../VideoList/VideoList";
import { Container, Jumbotron, Button } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./Classroom.css";
const io = require("socket.io-client");
const _ = require("lodash");

const Classroom = (props) => {
  const location = useLocation();
  const history = useHistory();
  const socket = useRef();
  const [isLoading, setLoading] = useState(true);
  const [roomId, setRoomId] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (location.state === undefined) {
      history.push("/rooms/");
      history.go();
    }
    console.log("PROPS");
    console.log(props);
    if (_.isEmpty(props.user)) {
      console.log("RETURNED");
      return;
    }
    socket.current = io("http://localhost:4000");
    setRoomId(location.state.roomId);
    console.log("Saying hello");
    socket.current.emit("hello", {
      roomID: roomId,
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      role: props.user.role,
    });
    setLoading(false);
  }, [props.user]);
  // console.log(location.state.detail); // result: 'some_value'

  console.log("ROOM ID");
  console.log(roomId);
  return (
    <div>
      <Jumbotron>
        <h1 className="display-4 text-center">Class Name</h1>
        {!isLoading && (
          <p className="text-center">
            Room ID: {roomId}
            <CopyToClipboard text={roomId} onCopy={() => setCopied(true)}>
              <Button style={{ marginLeft: "20px" }}>Copy</Button>
            </CopyToClipboard>
            {copied ? (
              <span style={{ color: "green", marginLeft: "20px" }}>
                Copied.
              </span>
            ) : null}
          </p>
        )}
      </Jumbotron>
      <Container>
        <div style={{ height: "1000px" }}>
          <div style={{ display: "inline-block" }}>
            {!isLoading && (
              <Whiteboard socket={socket.current} roomId={roomId} />
            )}
          </div>
          <div>
            {!isLoading && (
              <VideoList
                socket={socket.current}
                roomId={roomId}
                user={props.user}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Classroom;
