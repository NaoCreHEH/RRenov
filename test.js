import mysql from "mysql2/promise";
// import fs from "fs"; // option CA ci-dessous

const conn = await mysql.createConnection({
  host: "gateway01.eu-central-1.prod.aws.tidbcloud.com",
  port: 4000,
  user: "YBWvi7C1V2zZgpg.root",
  password: "bt7DTgKsiBzBg1ZK",
  database: "Rrenov",
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
    // optionnel si tu veux vérifier avec le CA :
    // ca: fs.readFileSync("C:/chemin/vers/ca.pem", "utf8"),
  },
});

const [rows] = await conn.query("SELECT * FROM services LIMIT 1");
console.log(rows);
await conn.end();
