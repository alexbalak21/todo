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

async function read_todos() {
    try {
        const connection = await connect_to_db()
        const [rows] = await connection.execute("SELECT * FROM todos")
        connection.end()
        return rows
    } catch (error) {
        console.log(error)
    }
}

async function read_todo_by_id(id = 0) {
    if (id === 0) return null
    try {
        const connection = await connect_to_db()
        const [row] = await connection.execute("SELECT * FROM todos WHERE id=?", [id])
        connection.unprepare()
        connection.end()
        if (row.length === 0) return null
        else return row[0]
    } catch (error) {
        console.log(error)
    }
}

async function update_todo(chage_name = "", change_description = "", todo_id = 0) {
    if (todo_id == 0 || (chage_name === "" && change_description === "")) return false
    try {
        const connection = await connect_to_db()
        const [result, fields] = await connection.execute("SELECT id FROM todos WHERE id=?", [todo_id])
        if (result.length === 0) return false
        row = result[0]
        let {id, name, description} = row
        console.log(id)
        if (chage_name !== "") name = chage_name
        if (change_description !== "") description = change_description
        const done = await connection.execute("UPDATE `todos` SET `name` = ?, `description` = ? WHERE `id` = ?", [
            name,
            description,
            id,
        ])
        connection.unprepare()
        connection.end()
        return true
    } catch (error) {
        throw error
    }
}

async function delete_todo(id = 0) {
    if (id === 0) return false
    try {
        const connection = await connect_to_db()
        const [result, fields] = await connection.execute("SELECT id FROM todos WHERE id=?", [id])
        if (result.length === 0) return false
        connection.execute("DELETE FROM `todos` WHERE `id` = ?", [id])
        connection.unprepare()
        connection.end()
        return true
    } catch (error) {
        throw error
    }
}

async function main() {
    const done = await delete_todo(3)
    console.log(done)
}
main()
