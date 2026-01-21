FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/Todo-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8100
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-Xmx512m", "-jar", "app.jar"]
