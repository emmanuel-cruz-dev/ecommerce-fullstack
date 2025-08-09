# Dockerfile para Backend (apps/backend/Dockerfile)
FROM node:20

# Instalar curl para health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copiar package.json del backend
COPY apps/backend/package*.json ./backend/

# Copiar package.json del domain
COPY domain/package*.json ./domain/

# Instalar dependencias del backend
WORKDIR /app/backend
RUN npm ci

# Instalar dependencias del domain
WORKDIR /app/domain
RUN npm ci

# Volver al directorio de trabajo del backend
WORKDIR /app/backend

# Copiar el código fuente del backend y domain
COPY apps/backend/ ./
COPY domain/ ../domain/

# Exponer puerto
EXPOSE 3000

# Comando para iniciar en modo desarrollo
CMD ["npm", "run", "dev"]