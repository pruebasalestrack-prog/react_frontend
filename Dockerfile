# Dockerfile para ILCA Pure Innovación Móvil - Desarrollo
FROM node:18-alpine

# Instalar herramientas necesarias
RUN apk add --no-cache git

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias primero (para aprovechar cache de Docker)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Comando para iniciar en modo desarrollo con host 0.0.0.0
# Esto permite acceder desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]