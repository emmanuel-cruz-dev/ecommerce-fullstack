FROM node:20 AS context-builder

# Establecemos directorio de trabajo
WORKDIR /usr/src/app

# Copiamos las carpetas de las aplicaciones y del dominio
COPY ./apps ./apps
COPY ./domain ./domain

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

# Instala las dependencias
WORKDIR /usr/src/app/apps/backend
RUN npm install

# Copia el código fuente
COPY --from=context-builder /usr/src/app/apps/backend ./
COPY --from=context-builder /usr/src/app/domain ./domain

# Compila el código
RUN npm run build

# Usa una imagen de Node.js
FROM node:20-slim

# Establecemos el directorio de trabajo
WORKDIR /usr/src/app

# Copiamos la aplicación construida desde la etapa anterior
COPY --from=backend-builder /usr/src/app/apps/backend/dist ./dist
COPY --from=backend-builder /usr/src/app/apps/backend/node_modules ./node_modules
COPY --from=backend-builder /usr/src/app/apps/backend/package*.json ./
COPY --from=backend-builder /usr/src/app/domain ./domain

# Expone el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]
