import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import styled from "styled-components";
const Peer = require("simple-peer");
const wrtc = require("wrtc");

const StyledVideo = styled.video`
  height: 50px;
  width: 44px;
  background-image: url(${process.env.PUBLIC_URL + "/user-solid.svg"});
`;
const Video = ({ index, peer, peersRef, socket, role }) => {
  const ref = useRef();
  const [buttonClicked, setButtonClicked] = useState(false);

  // const video = <StyledVideo alt="user-solid" playsInline autoPlay ref={ref} />;

  useEffect(() => {
    peer.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });

    peer.peer.on("close", () => {
      ref.current.srcObject = null;
      if (peersRef.current != null) {
        peersRef.current.splice(index, 1);
      }
    });
  }, []);

  const handleDrawingPrivilege = () => {
    console.log("Toggling drawing privileges");
    console.log(peer.peerID);
    if (buttonClicked) {
      socket.emit("toggleDrawingPrivileges", {
        peerID: peer.peerID,
        value: false,
      });
      return setButtonClicked(false);
    }
    socket.emit("toggleDrawingPrivileges", {
      peerID: peer.peerID,
      value: true,
    });
    return setButtonClicked(true);
  };

  const EnableDrawingButton = () => {
    if (role !== "Staff") {
      return null;
    }

    return !buttonClicked ? (
      <Button variant="success" onClick={handleDrawingPrivilege}>
        Give Drawing Privileges
      </Button>
    ) : (
      <Button variant="danger" onClick={handleDrawingPrivilege}>
        Rescind Drawing Privileges
      </Button>
    );
  };

  return (
    <div className="card">
      <div className="text-center">
        <StyledVideo alt="user-solid" playsInline autoPlay ref={ref} />
        <p>Name: {peer.firstName + " " + peer.lastName}</p>
        <p>Role: {peer.role}</p>
        <EnableDrawingButton />
      </div>
    </div>
  );
  // return null;
};

const VideoList = (props) => {
  const socket = props.socket;
  const roomId = props.roomId;
  const user = props.user;
  const peersRef = useRef([]);
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const joining = useRef(true);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
        socket.emit("getAllClients", { roomId });

        socket.on("receiveClients", (clients) => {
          clients = clients.filter((client) => client.socketID !== socket.id);
          const peers = [];
          if (joining.current) {
            clients.forEach((client) => {
              const peer = createPeer(client.socketID, socket.id, stream);
              peersRef.current.push({
                peerID: client.socketID,
                firstName: client.firstName,
                lastName: client.lastName,
                role: client.role,
                peer,
              });
              peers.push(client.socketID);
            });
            joining.current = false;
          }
          setPeers(peers);
          console.log("MY ID IS " + socket.id);
          console.log("Joining is " + joining.current);
        });

        socket.on("userJoined", (data) => {
          console.log("USER JOINED");
          console.log(data);
          const peer = addPeer(data.signal, data.callerID, stream);
          peersRef.current.push({
            peerID: data.callerID,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            peer,
          });
          setPeers((users) => [...users, peer]);
        });
        socket.on("receivingReturnedSignal", (data) => {
          console.log("I am receiving a returned signal from " + data.id);
          const item = peersRef.current.find((p) => p.peerID === data.id);
          item.peer.signal(data.signal);
        });
      });
  }, []);

  const createPeer = (receiverID, callerID, stream) => {
    console.log("I AM CREATING A PEER CONNECTION TO " + receiverID);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      reconnectTimer: 100,
      iceTransportPolicy: "relay",

      //STUN/TURN SERVER CONFIG
      // config: {
      //   iceServers: [
      //     {
      //       urls: "stun:numb.viagenie.ca:3478",
      //       username: "rsreubens96@gmail.com",
      //       credential: "CvpbG9Cw73Pot4",
      //     },
      //     {
      //       urls: "turn:numb.viagenie.ca:3478",
      //       username: "rsreubens96@gmail.com",
      //       credential: "CvpbG9Cw73Pot4",
      //     },
      //   ],
      // },
      stream,
    });

    peer.on("signal", (signal) => {
      console.log("I am sending a signal to " + receiverID);
      socket.emit("signalToClient", { receiverID, callerID, signal });
    });

    peer.on("error", (err) => {});

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      reconnectTimer: 100,
      iceTransportPolicy: "relay",

      //STUN/TURN SERVER CONFIG
      // config: {
      //   iceServers: [
      //     {
      //       urls: "stun:numb.viagenie.ca:3478",
      //       username: "rsreubens96@gmail.com",
      //       credential: "CvpbG9Cw73Pot4",
      //     },
      //     {
      //       urls: "turn:numb.viagenie.ca:3478",
      //       username: "rsreubens96@gmail.com",
      //       credential: "CvpbG9Cw73Pot4",
      //     },
      //   ],
      // },
      stream,
    });

    peer.on("signal", (signal) => {
      console.log("I am returning my signal to " + callerID);
      socket.emit("returningSignal", { signal, callerID });
    });

    peer.signal(incomingSignal);
    return peer;
  };

  return (
    <div>
      <Row xs={4} md={4}>
        <Col>
          <div className="card">
            <div className="text-center">
              <StyledVideo playsInline muted ref={userVideo} autoPlay />
              <p>Name: {user.firstName + " " + user.lastName}</p>
              <p>Role: {user.role}</p>
            </div>
          </div>
        </Col>
        {peersRef.current.map((peer, index) => {
          return (
            <Col>
              <Video
                key={index}
                peer={peer}
                peersRef={peersRef}
                socket={socket}
                role={props.user.role}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default VideoList;
