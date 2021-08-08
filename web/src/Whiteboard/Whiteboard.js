import React, { useState, useEffect } from "react";
import Sketch from "react-p5";
import "./Whiteboard.css";
import { CompactPicker } from "react-color";
import { Container } from "react-bootstrap";

const Whiteboard = ({ roomId, socket, user }) => {
  const [color, setColor] = useState("#000000");
  const [strokeWeight, setStrokeWeight] = useState(5);
  let background = "#FFFFFF";
  let isErasing = false;
  const [canDraw, setCanDraw] = useState(false);

  useEffect(() => {
    console.log("ROLE");
    if (user.role === "Staff") {
      setCanDraw(true);
    }
  }, [user]);

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
    if (!canDraw) {
      return;
    }
    const mouseX = p5.mouseX;
    const mouseY = p5.mouseY;
    const pmouseX = p5.pmouseX;
    const pmouseY = p5.pmouseY;

    p5.line(mouseX, mouseY, pmouseX, pmouseY);
    socket.emit("drawing", {
      mouseX,
      mouseY,
      pmouseX,
      pmouseY,
      color,
      strokeWeight,
    });
    return false;
  };

  socket.on("toggleDrawingPrivileges", (value) => {
    console.log(value);
    setCanDraw(value);
  });

  socket.on("erasing", (erase) => {
    if (!erase.erase) {
      isErasing = false;
      return window.p5.noErase();
    }
    isErasing = true;
    return window.p5.erase();
  });

  socket.on("drawing", (data) => {
    window.p5.stroke(data.color);
    window.p5.strokeWeight(data.strokeWeight);
    window.p5.line(data.mouseX, data.mouseY, data.pmouseX, data.pmouseY);
    window.p5.stroke(color);
    window.p5.strokeWeight(strokeWeight);
  });

  socket.on("clear", () => {
    window.p5.clear();
  });

  // socketRef.current.on("drawing", (data) => {
  //   console.log(this.p5);
  // });
  const handleColourChange = (e) => {
    setColor(e.hex);
    window.p5.stroke(e.hex);
  };

  const handlePencil = (e) => {
    if (isErasing) {
      socket.emit("erasing", {
        erase: false,
      });
      window.p5.noErase();
      isErasing = false;
    }
    window.p5.stroke(color);
  };

  const handleEraser = (e) => {
    isErasing = true;
    socket.emit("erasing", {
      erase: true,
    });
    window.p5.erase();
  };

  const handleStrokeSize = (e, size) => {
    setStrokeWeight(size);
    window.p5.strokeWeight(strokeWeight);
  };

  const handleClear = (e) => {
    socket.emit("clear");
    window.p5.clear();
  };

  return (
    <Container>
      <div>
        {canDraw && (
          <div
            className="btn-toolbar"
            id="toolbar"
            role="toolbar"
            aria-label="Toolbar with button groups"
          >
            <div
              className="btn-group mr-2"
              role="group"
              aria-label="First group"
            >
              <CompactPicker color={color} onChange={handleColourChange} />
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
            <div
              className="btn-group mr-2"
              role="group"
              aria-label="Second group"
            >
              <button
                type="button"
                onClick={(e) => handleStrokeSize(e, 5)}
                className="btn btn-secondary"
              >
                1
              </button>
              <button
                type="button"
                onClick={(e) => handleStrokeSize(e, 15)}
                className="btn btn-secondary"
              >
                2
              </button>
              <button
                type="button"
                onClick={(e) => handleStrokeSize(e, 25)}
                className="btn btn-secondary"
              >
                3
              </button>
              <button
                type="button"
                onClick={(e) => handleStrokeSize(e, 35)}
                className="btn btn-secondary"
              >
                4
              </button>
              <button
                type="button"
                onClick={(e) => handleStrokeSize(e, 45)}
                className="btn btn-secondary"
              >
                5
              </button>
            </div>
          </div>
        )}
        <div id="sketch">
          <Sketch setup={setup} touchMoved={touchMoved} />
        </div>
      </div>
    </Container>
  );
};

export default Whiteboard;
