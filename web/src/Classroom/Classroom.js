import React, { useEffect } from "react";
import Whiteboard from "../Whiteboard/Whiteboard";
import { useLocation, useHistory } from "react-router-dom";

const Classroom = (props) => {
  const location = useLocation();
  const history = useHistory();
  if (location.state === undefined) {
    history.push("/rooms/");
    return null;
  }
  // console.log(location.state.detail); // result: 'some_value'

  console.log("ASODUASHDUOASHDASUOHDAOUSDHAOUHOSAUDH");
  return (
    <div>
      <div className="centered">
        <Whiteboard />
      </div>
    </div>
  );
};

export default Classroom;
