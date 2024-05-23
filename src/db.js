import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "proyectodb",
  password: "1996",
  host: "localhost",
  port: 5432,
  database: "prueba",
});
