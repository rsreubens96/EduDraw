const { pool } = require("../config/dbConfig");
// const passport = require('passport');
// const initializePassport = require("../../config/passportConfig");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

// initializePassport(passport);

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

router.post("/users/teachers/register", async (req, res, next) => {
  console.log(req.body);
  console.log("hi");
  const query = await pool.query(
    `SELECT roleID FROM Roles WHERE Role = 'Teacher'`
  );
  const { roleid } = query.rows[0];
  register(req, res, roleid);
});

router.post("/users/students/register", async (req, res, next) => {
  console.log("HI");
  const query = await pool.query(
    `SELECT roleID FROM Roles WHERE Role = 'Student'`
  );
  const { roleid } = query.rows[0];
  register(req, res, roleid);
});

router.get("/teachers/dashboard", (req, res) => {
  console.log("You are successfully a teacher!");
  res.sendStatus(200);
});

function isTeacher(req, res, next) {
  if (!req.user) {
    return res.redirect("/users/teachers/login");
  }
  const query = `SELECT * FROM Users
    INNER JOIN Roles
    on Users.roleID = Roles.roleID
    WHERE Users.userID = $1
    AND
    role = 'Teacher'`;
  pool.query(query, [req.user.id], (err, results) => {
    if (results.rowCount > 0) {
      return next();
    }
    return res.redirect("/users/teachers/login");
  });
}

function isStudent(req, res, next) {
  if (!req.user) {
    return res.redirect("/users/students/login");
  }
  const query = `SELECT * FROM Users
    INNER JOIN Roles
    on Users.roleID = Roles.roleID
    WHERE Users.userID = $1
    AND
    role = 'Student'`;
  pool.query(query, [req.user.id], (err, results) => {
    if (results.rowCount > 0) {
      return next();
    }
    return res.redirect("/users/students/login");
  });
}

module.exports = router;
