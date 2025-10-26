# Etapa 1: Compilación
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Copiamos archivos de Maven y el código fuente
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copiamos el resto del código y compilamos
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Etapa 2: Ejecución
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copiamos el jar compilado desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Ejecutamos la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
