FROM node:20 AS builder

# Copia todo el contexto del proyecto a una carpeta temporal.
WORKDIR /usr/src/app
COPY . .

# Establece el directorio de trabajo dentro del frontend.
WORKDIR /usr/src/app/apps/frontend

# Instala todas las dependencias.
RUN npm ci

# Construye la aplicación.
RUN npm run build

# Usa una imagen más ligera de Nginx para servir la aplicación estática en producción.
FROM nginx:alpine

# Copia la salida de la construcción desde la imagen 'builder'
COPY --from=builder /usr/src/app/apps/frontend/dist /usr/share/nginx/html

# Creamos un archivo de configuración simple directamente en el Dockerfile
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf

# Expone el puerto 80
EXPOSE 80

# Comando para iniciar Nginx.
CMD ["nginx", "-g", "daemon off;"]
