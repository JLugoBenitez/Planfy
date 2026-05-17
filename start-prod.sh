#!/bin/bash

# Script para iniciar Planfy en producción con Docker

echo "🚀 Iniciando Planfy en modo producción..."

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

# Construir imágenes
echo "🔨 Construyendo imágenes Docker..."
$DOCKER_COMPOSE build

# Iniciar todos los servicios
echo "▶️  Iniciando todos los servicios..."
$DOCKER_COMPOSE up -d

# Mostrar estado
echo ""
echo "✅ Planfy iniciado correctamente!"
echo ""
echo "📊 Estado de los servicios:"
$DOCKER_COMPOSE ps
echo ""
echo "🌐 Accesos:"
echo "   - Frontend: http://localhost:4200"
echo "   - Backend API: http://localhost:8008"
echo "   - PostgreSQL: localhost:5444"
echo ""
echo "📋 Ver logs:"
echo "   $DOCKER_COMPOSE logs -f [postgres|backend|frontend]"
echo ""
echo "🛑 Detener:"
echo "   $DOCKER_COMPOSE down"
