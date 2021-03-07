const { pool } = require("../config/dbConfig");
const passport = require("passport");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

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
            console.log(err, results);
          }
        );
        res.sendStatus(200);
      }
    }
  );
}

router.post("/register/staff", async (req, res, next) => {
  console.log(req.body);
  console.log("hi");
  const query = await pool.query(
    `SELECT roleID FROM Roles WHERE Role = 'Teacher'`
  );
  const { roleid } = query.rows[0];
  register(req, res, roleid);
});

router.post("/register/student", async (req, res, next) => {
  console.log("HI");
  const query = await pool.query(
    `SELECT roleID FROM Roles WHERE Role = 'Student'`
  );
  const { roleid } = query.rows[0];
  register(req, res, roleid);
});

router.post("/authenticate/student", async (req, res, next) => {
  console.log("hi");
  passport.authenticate("login-student", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(400)
        .send({ error: "Username or password is incorrect" });
    }
    return res.sendStatus(200);
  })(req, res, next);
});

router.post("/authenticate/staff", async (req, res, next) => {
  passport.authenticate("login-staff", (err, user, info) => {
    console.log("hi");
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(400)
        .send({ error: "Username or password is incorrect" });
    }
    return res.sendStatus(200);
  })(req, res, next);
});

module.exports = router;
