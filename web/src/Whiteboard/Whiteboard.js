import React from "react";
import Sketch from "react-p5";
import "./Whiteboard.css";
import { GithubPicker } from "react-color";

const Whiteboard = ({ roomId, socket }) => {
  console.log("hi");
  socket.emit("hello", roomId);
  let color = "#000000";
  let background = "#FFFFFF";
  let strokeWeight = 20;
  let isErasing = false;

  const setup = (p5, canvasParentRef) => {
    // use parent to render the canvas in this ref
    // (without that p5 will render the canvas outside of your component)
    p5.createCanvas(1000, 600).parent(canvasParentRef);
    p5.background(background);
    p5.strokeWeight(strokeWeight);
    p5.stroke(color);
    window.p5 = p5;
  };

  const touchMoved = (p5) => {
    const mouseX = p5.mouseX;
    const mouseY = p5.mouseY;
    const pmouseX = p5.pmouseX;
    const pmouseY = p5.pmouseY;

    p5.line(mouseX, mouseY, pmouseX, pmouseY);
    socket.emit("drawing", {
      roomId,
      mouseX,
      mouseY,
      pmouseX,
      pmouseY,
      color,
      strokeWeight,
    });
    return false;
  };

  socket.on("erasing", (erase) => {
    console.log(erase);
    if (!erase.erase) {
      isErasing = false;
      return window.p5.noErase();
    }
    isErasing = true;
    return window.p5.erase();
  });

  socket.on("drawing", (data) => {
    window.p5.stroke(data.color);
    console.log("Stroke weight is " + strokeWeight);
    window.p5.strokeWeight(data.strokeWeight);
    window.p5.line(data.mouseX, data.mouseY, data.pmouseX, data.pmouseY);
    window.p5.stroke(color);
    window.p5.strokeWeight(strokeWeight);
  });

  // socketRef.current.on("drawing", (data) => {
  //   console.log(this.p5);
  // });
  const handleColourChange = (e) => {
    color = e.hex;
    window.p5.stroke(e.hex);
  };

  const handlePencil = (e) => {
    if (isErasing) {
      socket.emit("erasing", {
        roomId: roomId,
        erase: false,
      });
      window.p5.noErase();
      isErasing = false;
    }
    console.log(color);
    window.p5.stroke(color);
  };

  const handleEraser = (e) => {
    isErasing = true;
    socket.emit("erasing", {
      roomId: roomId,
      erase: true,
    });
    window.p5.erase();
  };

  const handleStrokeSize = (e) => {
    strokeWeight = 160;
    window.p5.strokeWeight(160);
  };

  const handleClear = (e) => {
    window.p5.clear();
  };

  return (
    <div>
      <div
        className="btn-toolbar"
        id="toolbar"
        role="toolbar"
        aria-label="Toolbar with button groups"
      >
        <div className="btn-group mr-2" role="group" aria-label="First group">
          <GithubPicker color={color} onChange={handleColourChange} />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePencil}
          >
            Pencil
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleEraser}
          >
            Eraser
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
        <div className="btn-group mr-2" role="group" aria-label="Second group">
          <button type="button" className="btn btn-secondary">
            5
          </button>
          <button type="button" className="btn btn-secondary">
            6
          </button>
          <button type="button" className="btn btn-secondary">
            7
          </button>
        </div>
        <div className="btn-group" role="group" aria-label="Third group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleStrokeSize}
          >
            8
          </button>
        </div>
      </div>
      <div id="sketch">
        <Sketch setup={setup} touchMoved={touchMoved} />
      </div>

      {/* <div className="slide">
        <iframe
          src="https://onedrive.live.com/embed?cid=697F5BAC0D135DF4&amp;resid=697F5BAC0D135DF4%212827&amp;authkey=APBLYqEqo4CcBtY&amp;em=2&amp;wdAr=1.7777777777777777"
          width="300px"
          height="300px"
          frameborder="0"
        >
          This is an embedded{" "}
          <a target="_blank" href="https://office.com">
            Microsoft Office
          </a>{" "}
          presentation, powered by{" "}
          <a target="_blank" href="https://office.com/webapps">
            Office
          </a>
          .
        </iframe>
      </div> */}
    </div>
  );
};

export default Whiteboard;
