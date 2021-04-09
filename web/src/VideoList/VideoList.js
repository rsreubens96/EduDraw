import React, { useEffect, useState, useRef } from "react";
import { Container } from "react-bootstrap";
import styled from "styled-components";
const Peer = require("simple-peer");
const wrtc = require("wrtc");

const StyledVideo = styled.video`
  height: 200px;
  width: 200px;
`;

const Video = ({ index, peer }) => {
  const ref = useRef();

  useEffect(() => {
    peer.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <StyledVideo playsInline autoPlay ref={ref} />;
};

const VideoList = ({ socket, roomId }) => {
  const [stream, setStream] = useState();
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);
  const joining = useRef(true);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
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
      trickle: true,
      // wrtc: wrtc,
      config: {
        iceServers: [
          {
            username: "rsreubens96@gmail.com",
            credential: "CvpbG9Cw73Pot4",
            urls: ["turn:numb.viagenie.ca:3478"],
          },
        ],
      },
      stream,
    });

    peer.on("signal", (signal) => {
      console.log("I am sending a signal to " + receiverID);
      socket.emit("signalToClient", { receiverID, callerID, signal });
    });

    peer.on("error", (err) => {
      console.log(err);
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: true,
      // wrtc: wrtc,
      config: {
        iceServers: [
          {
            username: "rsreubens96@gmail.com",
            credential: "CvpbG9Cw73Pot4",
            urls: ["turn:numb.viagenie.ca:3478"],
          },
        ],
      },
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

  return (
    <div>
      <StyledVideo playsInline muted ref={userVideo} autoPlay />
      <li>
        {peersRef.current.map((peer, index) => {
          return <Video key={index} peer={peer} />;
        })}
      </li>
    </div>
  );
};

export default VideoList;
