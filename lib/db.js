import mysql from "mysql2"

export async function executeQuery({ query, value = []}) {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    }).promise();

    try {
        const [results] = await pool.query(query, value);
        pool.end();
        return results;
    } catch (error) {
        throw Error(error.message);
    }
}