const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("../config/dbConfig");
const bcrypt = require("bcrypt");

const StaffLoginStrategy = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (username, password, done) => {
    const query = await pool.query(
      `SELECT roleID FROM Roles WHERE Role = 'Staff'`
    );
    const { roleid } = query.rows[0];
    pool.query(
      `SELECT * FROM Users WHERE email = $1 AND roleID = $2`,
      [username, roleid],
      (err, results) => {
        if (err) {
          return done(err);
        }
        if (results.rows.length > 0) {
          const user = results.rows[0];
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (isMatch) {
              return done(null, user);
            }
            return done(null, false, { message: "Password is incorrect." });
          });
        } else {
          return done(null, false, {
            message: "No user has registered with that email address.",
          });
        }
      }
    );
  }
);
module.exports = StaffLoginStrategy;
