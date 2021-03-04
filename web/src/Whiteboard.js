import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import "./Whiteboard.css";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const coloursRef = useRef(null);
  const socketRef = useRef(io("http://localhost:4000"));

  const ColourPicker = () => {
    const [colour, setColour] = useState("00000");
    return (
      <input
        type="color"
        value={colour}
        onChange={(e) => {
          setColour(e.target.value);
          current.color = e.target.value;
        }}
      />
    );
  };
  const current = {
    color: ColourPicker.colour,
    x: 0,
    y: 0,
  };
  useEffect(() => {
    // --------------- getContext() method returns a drawing context on the canvas-----

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // ----------------------- Colors --------------------------------------------------

    // const colors = document.getElementsByClassName("color");
    // // set the current color
    // const current = {
    //   color: "black",
    // };

    // // helper that will update the current color
    // const onColorUpdate = (e) => {
    //   console.log(e.target.className);
    //   current.color = e.target.className.split(" ")[1];
    // };

    // // loop through the color elements and add the click event listeners
    // for (let i = 0; i < colors.length; i++) {
    //   colors[i].addEventListener("click", onColorUpdate, false);
    // }
    let drawing = false;

    // ------------------------------- create the drawing ----------------------------

    const drawPencil = (x0, y0, x1, y1, color, emit) => {
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
      context.closePath();

      if (!emit) {
        return;
      }
      const width = canvas.width;
      const height = canvas.height;

      socketRef.current.emit("drawing", {
        x0: x0 / width,
        y0: y0 / height,
        x1: x1 / width,
        y1: y1 / height,
        color,
      });
    };

    // ---------------- mouse movement --------------------------------------

    const onMouseDown = (e) => {
      drawing = true;
      current.x = e.clientX;
      current.y = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!drawing) {
        return;
      }
      drawPencil(
        current.x,
        current.y,
        e.clientX,
        e.clientY,
        current.color,
        true
      );
      current.x = e.clientX;
      current.y = e.clientY;
    };

    const onMouseUp = (e) => {
      if (!drawing) {
        return;
      }
      drawing = false;
      drawPencil(
        current.x,
        current.y,
        e.clientX,
        e.clientY,
        current.color,
        true
      );
    };

    // ----------- limit the number of events per second -----------------------

    const throttle = (callback, delay) => {
      let previousCall = new Date().getTime();
      return function () {
        const time = new Date().getTime();

        if (time - previousCall >= delay) {
          previousCall = time;
          callback.apply(null, arguments);
        }
      };
    };

    // -----------------add event listeners to our canvas ----------------------

    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mouseup", onMouseUp, false);
    canvas.addEventListener("mouseout", onMouseUp, false);
    canvas.addEventListener("mousemove", throttle(onMouseMove, 10), false);

    // Touch support for mobile devices
    canvas.addEventListener("touchstart", onMouseDown, false);
    canvas.addEventListener("touchend", onMouseUp, false);
    canvas.addEventListener("touchcancel", onMouseUp, false);
    canvas.addEventListener("touchmove", throttle(onMouseMove, 10), false);

    // -------------- make the canvas fill its parent component -----------------

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", onResize, false);
    onResize();

    // ----------------------- socket.io connection ----------------------------
    socketRef.current.on("drawing", (data) => {
      const width = canvas.width;
      const height = canvas.height;
      drawPencil(
        data.x0 * width,
        data.y0 * height,
        data.x1 * width,
        data.y1 * height,
        data.color
      );
    });
  });

  // ------------- The Canvas and color elements --------------------------

  return (
    <div>
      <canvas ref={canvasRef} className="whiteboard" />

      <div ref={coloursRef} className="colors">
        <div className="color black" />
        <div className="color red" />
        <div className="color green" />
        <div className="color blue" />
        <div className="color yellow" />
      </div>
      <ColourPicker></ColourPicker>
    </div>
  );
};

export default Whiteboard;
