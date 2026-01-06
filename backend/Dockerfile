# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
# Skip tests to speed up the build
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
# Copy the built jar from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port Render will use
EXPOSE 8080

# Run the app
# -Xmx350m limits Java memory usage to prevent crashing on Render's 512MB Free Tier
ENTRYPOINT ["java", "-Xmx350m", "-jar", "app.jar"]