const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("../config/dbConfig");
const bcrypt = require("bcrypt");

const StudentLoginStrategy = new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (username, password, done) => {
    //Fetch the roleID that relates to the role 'Student'
    const query = await pool.query(
      `SELECT roleID FROM Roles WHERE Role = 'Student'`
    );
    const { roleid } = query.rows[0];
    //Query the email specified if it exists with the correct role
    pool.query(
      `SELECT * FROM Users WHERE email = $1 AND roleID = $2`,
      [username, roleid],
      (err, results) => {
        if (err) {
          return done(err);
        }
        if (results.rows.length > 0) {
          const user = results.rows[0];
          //Use the bcrypt compare function to hash the password specified and see if it is a match with the password that is in the database.
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (isMatch) {
              return done(null, user);
            }
            //If not, return false for authentication
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
module.exports = StudentLoginStrategy;
