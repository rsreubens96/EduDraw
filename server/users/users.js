const { pool } = require("../config/dbConfig");
const passport = require("passport");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("dotenv").config().parsed;

function register(req, res, roleid) {
  let { firstName, lastName, email, password, dateOfBirth } = req.body;
  pool.query(
    `SELECT * FROM Users WHERE email = $1`,
    [email],
    async (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.rows.length > 0) {
        return res.status(200).send({
          error: "Email already registered. Please select another email.",
        });
      } else {
        let hashedPassword = await bcrypt.hash(password, 10);
        pool.query(
          `INSERT INTO Users (firstName, lastName, email, password, dateOfBirth, roleID)
      VALUES ($1, $2, $3, $4, $5, $6)`,
          [firstName, lastName, email, hashedPassword, dateOfBirth, roleid],
          (err, results) => {
            if (err) {
              return res
                .status(500)
                .send({ error: "Oops, something went wrong." });
            }
            return res.sendStatus(200);
          }
        );
      }
    }
  );
}

router.post("/register/staff", async (req, res, next) => {
  const query = await pool.query(
    `SELECT roleID FROM Roles WHERE Role = 'Teacher'`
  );
  const { roleid } = query.rows[0];
  register(req, res, roleid);
});

router.post("/register/student", async (req, res, next) => {
  const query = await pool.query(
    `SELECT roleID FROM Roles WHERE Role = 'Student'`
  );
  const { roleid } = query.rows[0];
  register(req, res, roleid);
});

router.post("/authenticate/student", async (req, res, next) => {
  passport.authenticate("login-student", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(400)
        .send({ error: "Username or password is incorrect" });
    }
    if (err) {
      return next(err);
    }

    const accessToken = jwt.sign(
      {
        user: {
          userid: user.userid,
          role: "Student",
        },
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).send({ token: accessToken });
  })(req, res, next);
});

router.post("/authenticate/staff", async (req, res, next) => {
  passport.authenticate("login-staff", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(400)
        .send({ error: "Username or password is incorrect" });
    }
    const accessToken = jwt.sign(
      {
        user: {
          userid: user.userid,
          role: "Staff",
        },
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    return res.status(200).send({ token: accessToken });
  })(req, res, next);
});

router.get("/myself", async (req, res, next) => {
  // Retrieve authorization header and retrieve the JWT from it.
  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, config.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: "JWT signature does not match" });
    }
    const userId = decoded.user.userid;
    query = pool.query(
      `SELECT firstname, lastname, email, dateofbirth from Users where userid = $1`,
      [userId],
      (err, results) => {
        if (err) {
          return res.status(500).send({ error: "Oops, something went wrong." });
        }
        return res.status(200).send(results.rows[0]);
      }
    );
  });
});

module.exports = router;
