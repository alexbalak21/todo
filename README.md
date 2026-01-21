# Todo API

A simple REST API for managing todos, built with Spring Boot 4.0.1 and Java 21.

## Overview

This project provides a RESTful web service for creating, reading, updating, and deleting todo items. It uses Spring Boot with JPA for data persistence and MariaDB as the database backend.

## Features

- **Full CRUD Operations**: Create, read, update, and delete todos
- **Partial Updates**: Use PATCH requests to update specific fields
- **RESTful API**: Standard HTTP methods for all operations
- **Database Persistence**: Data stored in MariaDB with JPA/Hibernate ORM
- **Memory Optimized**: Configured with minimal caching and connection pooling

## Technology Stack

- **Framework**: Spring Boot 4.0.1
- **Language**: Java 21
- **Build Tool**: Maven
- **ORM**: JPA / Hibernate
- **Database**: MariaDB
- **Web**: Spring MVC

## Project Structure

```
src/main/java/app/
├── Application.java              # Spring Boot application entry point
├── controller/
│   ├── HomeController.java       # Health check endpoint
│   └── TodoController.java       # Todo REST API endpoints
├── model/
│   └── Todo.java                 # Todo entity model
└── repository/
    └── TodoRepository.java       # Data access layer
```

## API Endpoints

### Base URL
```
http://localhost:8100
```

### Endpoints

#### Get Home
```
GET /
```
Returns: `"Hello from Spring Boot App"`

#### Get All Todos
```
GET /todos
```
Returns: List of all todos

#### Get Todo by ID
```
GET /todos/{id}
```
Returns: Todo with specified ID (404 if not found)

#### Create Todo
```
POST /todos
Content-Type: application/json

{
  "title": "Buy groceries",
  "completed": false
}
```
Returns: Created todo with assigned ID

#### Update Todo (Full)
```
PUT /todos/{id}
Content-Type: application/json

{
  "title": "Updated title",
  "completed": true
}
```
Returns: Updated todo (404 if not found)

#### Update Todo (Partial)
```
PATCH /todos/{id}
Content-Type: application/json

{
  "completed": true
}
```
Returns: Updated todo with only specified fields changed (404 if not found)

#### Delete Todo
```
DELETE /todos/{id}
```
Returns: 204 No Content (404 if not found)

## Todo Model

```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false
}
```

**Fields:**
- `id` (Long): Unique identifier, auto-generated
- `title` (String): Description of the todo item
- `completed` (Boolean): Whether the todo is complete

## Configuration

Database and server settings are configured in `application.properties`:

```properties
server.port=8100
spring.datasource.url=jdbc:mariadb://mysql-alexb.alwaysdata.net:3306/alexb_db
spring.jpa.hibernate.ddl-auto=update
```

**Key Settings:**
- **Server Port**: 8100
- **Database**: MariaDB with automatic schema updates
- **Connection Pool**: HikariCP with max 2 connections (memory optimized)
- **Logging Level**: INFO (minimal verbosity)

## Building and Running

### Prerequisites
- Java 21
- Maven 3.6+
- MariaDB database access

### Build
```bash
mvn clean package
```

### Run
```bash
mvn spring-boot:run
```

Or run the JAR directly:
```bash
java -jar target/Todo-0.0.1-SNAPSHOT.jar
```

## Testing

Run the test suite:
```bash
mvn test
```

## Example Usage

### Create a Todo
```bash
curl -X POST http://localhost:8100/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Spring Boot", "completed": false}'
```

### Get All Todos
```bash
curl http://localhost:8100/todos
```

### Mark Todo as Completed
```bash
curl -X PATCH http://localhost:8100/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete a Todo
```bash
curl -X DELETE http://localhost:8100/todos/1
```

## Development

This project uses Spring Data JPA for database operations, providing a clean abstraction over Hibernate. The repository layer is minimal and leverages JpaRepository's built-in methods for common CRUD operations.

## Error Handling

- **400 Bad Request**: Invalid request format
- **404 Not Found**: Todo with specified ID doesn't exist
- **500 Internal Server Error**: Server-side error

All error responses include appropriate HTTP status codes.

## Performance Optimizations

- HikariCP connection pooling with minimal pool size (2 connections)
- Hibernate second-level cache disabled to reduce memory usage
- Query cache disabled
- SQL formatting disabled for production
- Minimal logging configuration

## License

Unlicensed

## Support

For issues or questions, refer to the [Spring Boot documentation](https://spring.io/projects/spring-boot) or [Spring Data JPA guide](https://spring.io/guides/gs/accessing-data-jpa/).
