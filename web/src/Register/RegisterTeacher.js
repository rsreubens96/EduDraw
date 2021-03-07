import React from "react";
import Register from "./RegisterForm";

function RegisterTeacher() {
  return (
    <div>
      <h1 className="text-center">
        <span className="font-weight-bold">EduDraw</span>
      </h1>
      <h2 className="text-center">Register as staff</h2>
      <Register></Register>
    </div>
  );
}

export default RegisterTeacher;
