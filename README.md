# Todo API

A simple Todo API built with Spring Boot, JPA/Hibernate, and PostgreSQL. Includes Docker packaging and deployment guides.

## Overview

RESTful service to create, read, update, and delete todo items. Optimized for small footprints with minimal connection pooling and logging. Root endpoint returns a friendly greeting for quick health checks.

## Tech Stack

- Framework: Spring Boot 4.0.1
- Language: Java 21
- Build: Maven (wrapper included)
- Web: Spring MVC
- Persistence: Spring Data JPA (Hibernate)
- Database: PostgreSQL

## Project Structure

```
src/main/java/app/
├── Application.java              # Spring Boot entry point
├── controller/
│   ├── HomeController.java       # GET / → health greeting
│   └── TodoController.java       # CRUD + PATCH for todos
├── model/
│   └── Todo.java                 # id, title, completed
└── repository/
    └── TodoRepository.java       # JpaRepository<Todo, Long>
```

## Configuration

All runtime settings are in `src/main/resources/application.properties` and read from environment variables with defaults where applicable:

```
PORT                         # Web server port (default 8100)
DATABASE_URL                 # e.g. jdbc:postgresql://localhost:5432/todo
DATABASE_USERNAME            # DB user
DATABASE_PASSWORD            # DB password
```

Example `.env` (local development):

```
PORT=8100
DATABASE_URL=jdbc:postgresql://localhost:5432/todo
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
```

Windows PowerShell helpers:

```
./load-env.ps1          # Loads .env into current session
```

## Build & Run (Local)

Prerequisites: Java 21, PostgreSQL reachable with the env above.

Using Maven Wrapper on Windows:

```powershell
./mvnw.cmd -q -DskipTests package
./mvnw.cmd spring-boot:run
```

Or run the JAR:

```powershell
java -jar target/Todo-0.0.1-SNAPSHOT.jar
```

Run tests:

```powershell
./mvnw.cmd test
```

## Docker

Dockerfile packages the built JAR and exposes port 8100.

Build image:

```powershell
docker build -t todo-api .
```

Run container (maps 8100 and passes DB env):

```powershell
docker run --rm -p 8100:8100 ^
  -e PORT=8100 ^
  -e DATABASE_URL="jdbc:postgresql://host.docker.internal:5432/todo" ^
  -e DATABASE_USERNAME=postgres ^
  -e DATABASE_PASSWORD=postgres ^
  todo-api
```

Push/pull from Docker Hub: see `docker_itegration.md` for a step-by-step guide. If you have an image like `alexbalak/todo-api:latest`, run it with the same `-e` variables as above.

## API

Base URL (local):

```
http://localhost:8100
```

- GET / → "Hello from Todo API"
- GET /todos → List all todos
- GET /todos/{id} → Get one (404 if missing)
- POST /todos → Create
- PUT /todos/{id} → Full update
- PATCH /todos/{id} → Partial update (currently supports `completed`)
- DELETE /todos/{id} → Delete

Example payloads:

Create:

```json
{
  "title": "Buy groceries",
  "completed": false
}
```

Full update:

```json
{
  "title": "Updated title",
  "completed": true
}
```

Partial update:

```json
{
  "completed": true
}
```

## Model

```json
{
  "id": 1,
  "title": "Buy groceries",
  "completed": false
}
```

## Handy Requests

Use `src/main/resources/requests.http` for one-click requests in VS Code/IntelliJ. It includes both local and hosted examples.

## Deployment

- Render: see `DEPLOY_RENDER.md` (set `PORT` and PostgreSQL env vars).
- Docker Hub workflow: see `docker_itegration.md` (build, tag, push).

## Notes

- Error handling returns appropriate HTTP status codes (`404` on missing items, etc.).
- Hibernate DDL auto is `update`; adjust for production if needed.
