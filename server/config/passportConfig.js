const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

function initialize(passport) {
  passport.use(
    { usernameField: "email", passwordField: "password" },
    new LocalStrategy((username, password, done) => {
      pool.query(
        `SELECT * FROM Users WHERE email = $1`,
        [username],
        (err, results) => {
          if (err) {
            throw err;
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
          }
          return done(null, false, {
            message: "No user has registered with that email address.",
          });
        }
      );
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    pool.query(
      `SELECT * FROM Users WHERE userID = $1`,
      [id],
      (err, results) => {
        if (err) {
          return done(err);
        }
        console.log(`ID is ${results.rows[0].id}`);
        return done(null, results.rows[0]);
      }
    );
  });
}

module.exports = initialize;
