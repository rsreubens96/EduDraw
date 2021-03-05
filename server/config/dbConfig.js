const { Pool } = require("pg");
const connectionString =
  "postgresql://postgres:postgres@localhost:5432/edudraw";

const pool = new Pool({
  connectionString,
});

module.exports = { pool };
