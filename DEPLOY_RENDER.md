# Deploy Todo API to Render

Complete guide for building, testing, and deploying your Spring Boot Todo API to Render with PostgreSQL.

---

## Prerequisites

- Java 21
- Maven (or use included Maven Wrapper)
- Docker Desktop (for containerization)
- PostgreSQL database (local for testing, managed on Render)
- Docker Hub account
- Render account

---

## Part 1: Local Development & Testing

### Step 1: Configure Environment Variables

Create a `.env` file in your project root:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/todo
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=root
PORT=8100
```

Your `application.properties` reads these variables:

```properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver
server.port=${PORT:8100}
```

### Step 2: Load Environment Variables (Windows)

Use the provided `load-env.ps1` script:

```powershell
./load-env.ps1
```

This loads all `.env` variables into your PowerShell session.

### Step 3: Run the Application Locally

Test your app with Maven:

```powershell
mvn spring-boot:run
```

Or with Maven Wrapper:

```powershell
./mvnw.cmd spring-boot:run
```

Visit `http://localhost:8100` - you should see `"Hello from Todo API"`

Test the API:

```powershell
curl http://localhost:8100/todos
```

---

## Part 2: Build the Application

### Build JAR File

With tests:

```powershell
mvn clean package
```

Skip tests (faster):

```powershell
mvn clean package -DskipTests
```

Or with Maven Wrapper:

```powershell
./mvnw.cmd clean package -DskipTests
```

Your JAR will be created at:

```
target/Todo-0.0.1-SNAPSHOT.jar
```

### Test the JAR Locally

Make sure your `.env` variables are loaded, then:

```powershell
java -jar target/Todo-0.0.1-SNAPSHOT.jar
```

---

## Part 3: Docker Build & Push

### Step 1: Ensure Dockerfile Exists

Your `Dockerfile` should look like this:

```dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/Todo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8100
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-Xmx512m", "-jar", "app.jar"]
```

- **Base Image**: `eclipse-temurin:21-jre-alpine` (lightweight Java 21 runtime)
- **Memory Limit**: `-Xmx512m` limits RAM usage to 512 MB

### Step 2: Build Docker Image

```powershell
docker build -t todo-api .
```

**Useful Docker Commands:**

List running containers:

```powershell
docker ps
```

List all containers (including stopped):

```powershell
docker ps -a
```

Stop a container:

```powershell
docker stop <container_id_or_name>
```

Remove a container:

```powershell
docker rm <container_id_or_name>
```

Remove all stopped containers:

```powershell
docker container prune
```

### Step 3: Test Docker Image Locally

Run your container with environment variables:

```powershell
docker run --rm -p 8100:8100 ^
  -e PORT=8100 ^
  -e DATABASE_URL="jdbc:postgresql://host.docker.internal:5432/todo" ^
  -e DATABASE_USERNAME=postgres ^
  -e DATABASE_PASSWORD=root ^
  todo-api
```

Note: `host.docker.internal` allows the container to access your host machine's PostgreSQL.

Test it:

```powershell
curl http://localhost:8100
curl http://localhost:8100/todos
```

### Step 4: Push to Docker Hub

Log in to Docker Hub:

```powershell
docker login
```

Tag your image (replace `YOUR_USERNAME` with your Docker Hub username):

```powershell
docker tag todo-api YOUR_USERNAME/todo-api:latest
```

Example:

```powershell
docker tag todo-api alexbalak/todo-api:latest
```

Push to Docker Hub:

```powershell
docker push YOUR_USERNAME/todo-api:latest
```

Example:

```powershell
docker push alexbalak/todo-api:latest
```

Verify on Docker Hub:

```
https://hub.docker.com/r/YOUR_USERNAME/todo-api
```

---

## Part 4: Deploy to Render

### Step 1: Create PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name**: `todo-db` (or any name)
   - **Database**: `todo` (or any name)
   - **User**: Auto-generated
   - **Region**: Choose closest to you
   - **Plan**: Free or paid
4. Click **Create Database**
5. Save the **Internal Database URL** (you'll use this for the app)

Example Internal URL:

```
postgresql://todo_db_user:password@dpg-xxxxx-a/todo_db
```

Or in JDBC format:

```
jdbc:postgresql://dpg-xxxxx-a.oregon-postgres.render.com/todo_db
```

### Step 2: Create Web Service on Render

#### Option A: Deploy from Docker Hub (Recommended)

1. Click **New +** → **Web Service**
2. Choose **Deploy an existing image from a registry**
3. Enter your Docker Hub image:
   ```
   docker.io/YOUR_USERNAME/todo-api:latest
   ```
   Example:
   ```
   docker.io/alexbalak/todo-api:latest
   ```
4. Configure:
   - **Name**: `todo-api`
   - **Region**: Same as database
   - **Instance Type**: Free or paid
5. Add **Environment Variables**:
   ```
   PORT=8100
   DATABASE_URL=jdbc:postgresql://dpg-xxxxx-a.oregon-postgres.render.com/todo_db
   DATABASE_USERNAME=todo_db_user
   DATABASE_PASSWORD=<from Render dashboard>
   ```
6. Click **Create Web Service**

#### Option B: Deploy from GitHub Repository

1. Push your code to GitHub
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `todo-api`
   - **Environment**: Docker
   - **Build Command**: (leave blank, uses Dockerfile)
   - **Instance Type**: Free or paid
5. Add **Environment Variables** (same as Option A)
6. Click **Create Web Service**

### Step 3: Verify Deployment

Render will provide a URL like:

```
https://todo-api-xxxx.onrender.com
```

Test your deployment:

```powershell
curl https://todo-api-xxxx.onrender.com
curl https://todo-api-xxxx.onrender.com/todos
```

Or open in browser.

### Step 4: Create a Todo via API

```powershell
curl -X POST https://todo-api-xxxx.onrender.com/todos ^
  -H "Content-Type: application/json" ^
  -d "{\"title\": \"Deploy to Render\", \"completed\": true}"
```

---

## Troubleshooting

### Application won't start

- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set correctly
- Ensure PostgreSQL database is running and accessible

### Database connection issues

- Use the **Internal Database URL** from Render (faster, private network)
- Format: `jdbc:postgresql://hostname/database_name`
- Ensure username and password match exactly

### Out of memory errors

- Increase memory in Dockerfile: `-Xmx512m` → `-Xmx768m`
- Or upgrade to a paid Render instance with more RAM

### Port binding errors

- Render automatically sets `PORT` environment variable
- Ensure `application.properties` uses `${PORT:8100}`

---

## Continuous Deployment

### Update Workflow

1. Make code changes locally
2. Build and test:
   ```powershell
   mvn clean package -DskipTests
   ```
3. Rebuild Docker image:
   ```powershell
   docker build -t todo-api .
   docker tag todo-api YOUR_USERNAME/todo-api:latest
   docker push YOUR_USERNAME/todo-api:latest
   ```
4. Render will auto-detect the new image and redeploy (if configured)
5. Or manually trigger deploy in Render Dashboard

---

## Environment Variables Summary

| Variable | Local Example | Render Example |
|----------|---------------|----------------|
| `PORT` | `8100` | `8100` (or auto-set by Render) |
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/todo` | `jdbc:postgresql://dpg-xxx.render.com/todo_db` |
| `DATABASE_USERNAME` | `postgres` | `todo_db_user` (from Render) |
| `DATABASE_PASSWORD` | `root` | Auto-generated (from Render) |

---

## Useful Links

- [Render Docs - Deploy with Docker](https://render.com/docs/deploy-an-image)
- [Render Docs - PostgreSQL](https://render.com/docs/databases)
- [Spring Boot on Render](https://render.com/docs/deploy-spring-boot)
- [Docker Hub](https://hub.docker.com/)

---

## Quick Reference

### Local Development

```powershell
./load-env.ps1
./mvnw.cmd spring-boot:run
```

### Build & Package

```powershell
./mvnw.cmd clean package -DskipTests
```

### Docker Build & Push

```powershell
docker build -t todo-api .
docker tag todo-api YOUR_USERNAME/todo-api:latest
docker push YOUR_USERNAME/todo-api:latest
```

### Test Endpoints

```powershell
curl http://localhost:8100
curl http://localhost:8100/todos
```

---

**You're ready to deploy! 🚀**
