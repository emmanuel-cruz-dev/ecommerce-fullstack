# Usa una imagen base de Node.js para la fase de construcción.
# Esto es para instalar dependencias y construir la aplicación.
FROM node:20 AS builder

# Copia todo el contexto del proyecto a una carpeta temporal.
# Esto asegura que todas las carpetas compartidas estén disponibles.
WORKDIR /usr/src/app
COPY . .

# Establece el directorio de trabajo dentro del frontend.
# A partir de ahora, todas las rutas relativas serán desde esta carpeta.
WORKDIR /usr/src/app/apps/frontend

# Instala todas las dependencias. El comando 'ci' es más seguro para CI/CD.
RUN npm ci

# Construye la aplicación. Esto ejecutará 'tsc' y 'vite build'.
RUN npm run build

# Usa una imagen más ligera de Nginx para servir la aplicación estática en producción.
FROM nginx:alpine

# Copia la salida de la construcción desde la imagen 'builder'
# al directorio de Nginx.
COPY --from=builder /usr/src/app/apps/frontend/dist /usr/share/nginx/html

# Configuración de Nginx para el frontend
# Creamos un archivo de configuración simple directamente en el Dockerfile
RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf

# Expone el puerto 80 que Nginx usa por defecto.
EXPOSE 80

# Comando para iniciar Nginx.
CMD ["nginx", "-g", "daemon off;"]
