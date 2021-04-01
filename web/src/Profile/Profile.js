import React, { useEffect, useState } from "react";
import jwt from "jwt-decode";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import _ from "lodash";
const Profile = () => {
  const [userInfo, setUserInfo] = useState({});

  const getDetails = () => {
    const token = localStorage.getItem("token");
    if (token === null || token === "undefined" || typeof token != "string") {
      return;
    }
    console.log(jwt(token));
    console.log(token);
    axios
      .get("http://localhost:4000/myself", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setUserInfo({
            firstName: res.data.firstname,
            lastName: res.data.lastname,
            email: res.data.email,
            role: jwt(token).user.role,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {});
  };

  useEffect(() => {
    getDetails();
  }, []);

  if (_.isEmpty(userInfo)) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }
  return (
    <div>
      <h1>
        {" "}
        Hello {userInfo.firstName + " " + userInfo.lastName}, you are a{" "}
        {userInfo.role}{" "}
      </h1>
      <iframe
        src="https://onedrive.live.com/embed?cid=697F5BAC0D135DF4&amp;resid=697F5BAC0D135DF4%212827&amp;authkey=APBLYqEqo4CcBtY&amp;em=2&amp;wdAr=1.7777777777777777"
        width="350px"
        height="221px"
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
    </div>
  );
};

export default Profile;
