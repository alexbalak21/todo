const mysql = require("mysql")

function connect_to_db() {
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "todo",
    })
    con.connect(function (err) {
        if (err) throw err
        // else console.log("Connected")
        else return con
    })
}

function query_db(con) {
    const sql_query = "CREATE TABLE totos (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), description TEXT)"
    con.query(sql_query, function (err, result) {
        if (err) throw err
        console.log("Table created")
    })
}

function main() {
    try {
        const conn = connect_to_db()
        query_db(conn)
    } catch (error) {
        console.log(error)
    }
}

main()
