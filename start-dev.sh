#!/bin/bash

# Script para iniciar el entorno de desarrollo de Planfy

echo "🚀 Iniciando Planfy en modo desarrollo..."

# Detectar comando de docker compose
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

# Crear directorio de logs si no existe
mkdir -p logs

# Detener contenedores previos
echo "🛑 Deteniendo contenedores previos..."
$DOCKER_COMPOSE down 2>/dev/null

# Iniciar base de datos
echo "🗄️  Iniciando PostgreSQL..."
$DOCKER_COMPOSE up -d postgres

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 5

# Iniciar backend en segundo plano
echo "⚙️  Iniciando backend Spring Boot..."
cd backend/planfy-backend
./mvnw spring-boot:run > ../../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ../..

# Dar tiempo al backend para iniciar
echo "⏳ Esperando a que el backend esté listo..."
sleep 10

# Iniciar frontend
echo "🎨 Iniciando frontend Angular..."
cd frontend/planfyApp
npm start

# Cleanup al salir
trap "kill $BACKEND_PID 2>/dev/null; $DOCKER_COMPOSE down" EXIT
