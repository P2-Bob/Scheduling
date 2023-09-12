import mysql from "mysql2"
import { sql } from "@vercel/postgres"

export async function executeQuery({ query, value = []}) {
    /* const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    }).promise();
 */
    try {
        const { rows } = await sql.query(query, value);
        //const [results] = await pool.query(query, value);
        //console.log(rows);
        return rows;
    } catch (error) {
        throw Error(error.message);
    }
}