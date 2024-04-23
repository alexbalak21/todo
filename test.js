const mysql = require("mysql2/promise")

async function connect_to_db() {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "todo",
        waitForConnections: true,
        connectionLimit: 100,
        queueLimit: 0,
    })
    connection.addListener("error", (err) => {
        if (err instanceof Error) throw err
    })
    return connection
}

async function create_todo(name = "name", description = "description") {
    try {
        const connection = await connect_to_db()
        const result = await connection.execute("INSERT INTO todos (name, description) VALUES (?, ?)", [
            `${name}`,
            `${description}`,
        ])
        connection.unprepare()
        connection.end()
        console.log(result)
    } catch (error) {
        throw error
    }
}

async function read_todos() {}

function query_db() {
    try {
        const connection = connect_to_db()
        connection.prepare()
    } catch (error) {
        throw error
    }
    // const sql_query = "CREATE TABLE todos (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), description TEXT)"
    // con.query("DROP TABLE todos")
    con.query(sql_query)
    console.log("Table created")
    con.query("INSERT INTO todos (name, description) VALUES ('First Task', 'description 1')")
    console.log("INSERT DONE")
    // con.query("DROP TABLE todos")
    // console.log("TABLE DROPED")
}

async function select_all(CONN) {
    const [rows, fields] = await CONN.query("SELECT * FROM todos")
    return [rows, fields]
}

async function main() {
    const conn = await connect_to_db()
    console.log("DATABASE CONNECTED")
    const result = await select_all(conn)
    console.log(result[0])
    console.log("DONE")
    conn.end()
}

main()
