# 🚀 Build & Push a Docker Image to Docker Hub

This guide shows the simplest workflow to package your Spring Boot app, build a Docker image, and push it to Docker Hub.

---

## 0. Package your Spring Boot application

Run this from your project root to generate the JAR file:

```sh
mvn clean package -DskipTests
```

This creates a JAR inside the `target/` directory.

---

## Dockerfile Example

Below is the Dockerfile used in this guide:

```dockerfile
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8100
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

## 1. Build the Docker image

```sh
docker build -t todo-api .
```

---

## 2. Log in to Docker Hub

```sh
docker login
```

Enter your Docker Hub username and password (or access token).

---

## 3. Tag the image with your Docker Hub repository

Replace `YOUR_USERNAME` with your Docker Hub username.

```sh
docker tag todo-api YOUR_USERNAME/todo-api:latest
```

Example:

```sh
docker tag todo-api alexbalak/todo-api:latest
```

---

## 4. Push the image to Docker Hub

```sh
docker push YOUR_USERNAME/todo-api:latest
```

---

## 5. Verify on Docker Hub

Visit:

```
https://hub.docker.com/r/YOUR_USERNAME/todo-api
```

Your image should now be visible and publicly pullable.

---

## 6. Pull the image anywhere

```sh
docker pull YOUR_USERNAME/todo-api:latest
```

---
