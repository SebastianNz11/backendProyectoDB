import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "postgres",
  password: "admin",
  host: "localhost",
  port: 5433,
  database: "prueba",
});
