const { Pool } = require("pg");
const connectionString =
  "postgres://elcyzkvt:UQbbiAkSvDWBV_pa51HVA4BtMNUUVPP9@tai.db.elephantsql.com:5432/elcyzkvt";

const pool = new Pool({
  connectionString,
});

module.exports = { pool };
