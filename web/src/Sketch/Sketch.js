import React from "react";
import p5 from "p5";

const Sketch = (props) => {
  this.myRef = createRef();

  const s = (sketch) => {
    sketch.setup = () => {
      sketch.createCanvas(1000, 700).parent(canvasParentRef);
      sketch.background(255, 204, 0);
      sketch.strokeWeight(20);
      sketch.stroke(135, 20, 20);
    };

    sketch.draw = (p) => {
      sketch.ellipse(200, 200, 70, 70);
    };
  };

  this.myP5 = new p5(this.Sketch, this.myRef.current);

  return <div ref={this.myRef}></div>;
};
export default Sketch;
