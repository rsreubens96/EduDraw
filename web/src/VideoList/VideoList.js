import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
const Peer = require("simple-peer");
const wrtc = require("wrtc");

const StyledVideo = styled.video`
  height: 50px;
  width: 50px;
  background-image: url(${process.env.PUBLIC_URL + "/user-solid.svg"});
`;
const Video = ({ index, peer, peersRef }) => {
  const ref = useRef();

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

  return (
    <div className="card">
      <div className="text-center">
        <StyledVideo alt="user-solid" playsInline autoPlay ref={ref} />;
        <h1>test name</h1>
      </div>
    </div>
  );
  // return null;
};

const VideoList = ({ socket, roomId }) => {
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
          console.log("Receiving clients and joining is" + joining.current);
          console.log(clients);
          clients = clients.filter((client) => client !== socket.id);
          const peers = [];
          if (joining.current) {
            clients.forEach((clientID) => {
              const peer = createPeer(clientID, socket.id, stream);
              peersRef.current.push({
                peerID: clientID,
                peer,
              });
              peers.push(clientID);
            });
            joining.current = false;
          }
          setPeers(peers);
          console.log("MY ID IS " + socket.id);
          console.log("Joining is " + joining.current);
          console.log(peers);
        });

        socket.on("userJoined", (data) => {
          console.log("USER JOIN TRIGGERED AND CALLER ID IS " + data.callerID);
          const peer = addPeer(data.signal, data.callerID, stream);
          peersRef.current.push({
            peerID: data.callerID,
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

    peer.on("error", (err) => {
      console.log(err);
    });

    // setVideos((videos) => [
    //   ...videos,
    //   <StyledVideo playsInline autoPlay ref={stream}></StyledVideo>,
    // ]);

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      reconnectTimer: 100,
      iceTransportPolicy: "relay",
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

    peer.on("error", (err) => {
      console.log(err);
    });

    peer.signal(incomingSignal);
    return peer;
  };

  // const RenderPeers = () => {
  //   console.log("RENDER PEERS");
  //   console.log(videos);
  //   if (videos.current.length > 0) {
  //     console.log("Render peers 2");
  //     // peersRef.current.map((peer, index) => {
  //     //   return <Video key={index} peer={peer} />;
  //     // });
  //     videos.current.map((video) => {
  //       console.log(video);
  //       return video;
  //     });
  //   }
  //   return null;
  // };

  return (
    <div>
      <Row xs={4} md={4}>
        <Col>
          <div className="card">
            <div className="text-center">
              <StyledVideo playsInline muted ref={userVideo} autoPlay />
              <h1>test name</h1>
            </div>
          </div>
        </Col>
        {peersRef.current.map((peer, index) => {
          return (
            <Col>
              <Video key={index} peer={peer} peersRef={peersRef} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default VideoList;
