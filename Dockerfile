# syntax=docker/dockerfile:1

################################################################################
# Build stage: compile Gradle project and assemble jar
FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /app

# Copy Gradle wrapper and project files
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle settings.gradle ./

# Copy source code
COPY src/ src/

# Make gradlew executable
RUN chmod +x gradlew

# Download dependencies and build jar
RUN ./gradlew build -x test --no-daemon

################################################################################
# Runtime stage: minimal image to run the jar
FROM eclipse-temurin:21-jre-jammy AS runtime

# Create non-root user
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser
USER appuser

WORKDIR /app

# Copy the jar from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
