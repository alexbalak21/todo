const mysql = require("mysql2/promise")

async function connect_to_db() {
    return await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "todo",
        waitForConnections: true,
        connectionLimit: 100,
        queueLimit: 0,
    })
}

function query_db(con) {
    const sql_query = "CREATE TABLE todos (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), description TEXT)"
    // con.query("DROP TABLE todos")
    con.query(sql_query)
    console.log("Table created")
    con.query("DROP TABLE todos")
    console.log("TABLE DROPED")
}

async function main() {
    const conn = await connect_to_db()
    console.log("DATABASE CONNECTED")
    query_db(conn)
    console.log("DONE")
    conn.end()
}

main()
