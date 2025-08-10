# --- Etapa 1: Preparación del contexto de construcción ---
# Usamos una imagen ligera de Node.js v20 para la preparación
FROM node:20 AS context-builder

# Establecemos el directorio de trabajo
WORKDIR /usr/src/app

# Copiamos las carpetas de las aplicaciones y del dominio
COPY ./apps ./apps
COPY ./domain ./domain

# --- Etapa 2: Construcción del backend ---
# Usamos la misma imagen base de Node.js v20
FROM node:20 AS backend-builder

# Establecemos el directorio de trabajo
WORKDIR /usr/src/app

# Instalamos curl
RUN apt-get update && apt-get install -y curl

# Copiamos los archivos de la etapa anterior
COPY --from=context-builder /usr/src/app/apps/backend ./apps/backend
COPY --from=context-builder /usr/src/app/domain ./domain
COPY --from=context-builder /usr/src/app/apps/backend/package*.json ./apps/backend/
COPY --from=context-builder /usr/src/app/domain/package*.json ./domain/

# Instalamos las dependencias
WORKDIR /usr/src/app/apps/backend
RUN npm install

# Copiamos el código fuente
COPY --from=context-builder /usr/src/app/apps/backend ./
COPY --from=context-builder /usr/src/app/domain ./domain

# Compilamos el código
RUN npm run build

# --- Etapa 3: Producción del backend ---
# Usamos una imagen de Node.js solo para producción para tener un contenedor más ligero
FROM node:20-slim

# Establecemos el directorio de trabajo
WORKDIR /usr/src/app

# Copiamos la aplicación construida desde la etapa anterior
COPY --from=backend-builder /usr/src/app/apps/backend/dist ./dist
COPY --from=backend-builder /usr/src/app/apps/backend/node_modules ./node_modules
COPY --from=backend-builder /usr/src/app/apps/backend/package*.json ./
COPY --from=backend-builder /usr/src/app/domain ./domain

# Exponemos el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
