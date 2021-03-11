import React, { useEffect, useState } from "react";
import jwt from "jwt-decode";
import axios from "axios";
const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });

  const getDetails = () => {
    const token = localStorage.getItem("token");
    console.log(jwt(token));
    console.log(token);
    axios
      .get("http://localhost:4000/myself", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setUserInfo((userInfo) => ({
            ...userInfo,
            ["firstName"]: res.data.firstname,
            ["lastName"]: res.data.lastname,
            ["firstName"]: res.data.firstname,
            ["role"]: jwt(token).user.role,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {});
  };

  useEffect(() => {
    getDetails();
    console.log(userInfo.firstName);
  }, []);

  return (
    <div>
      <h1>
        {" "}
        Hello {userInfo.firstName + " " + userInfo.lastName}, you are a{" "}
        {userInfo.role}{" "}
      </h1>
    </div>
  );
};

export default Profile;
