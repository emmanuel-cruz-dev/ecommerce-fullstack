# 🛒 E-commerce Fullstack - Proyecto Academia ForIT

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)

Este proyecto es la culminación de un curso de Programación Fullstack en la **Academia ForIT**, desarrollado como un e-commerce completo. Implementado como un monorepo, el proyecto sigue principios de **Arquitectura Limpia** y un enfoque de **Desarrollo Guiado por Pruebas (TDD)**.

---

## 🧑‍💻 Cómo ejecutar el proyecto

### 1. Instalar dependencias

```sh
npm install
cd apps/backend && npm install
cd apps/frontend && npm install
cd domain && npm install
```

### 2. Ejecutar tests (TDD)

#### Dominio

```sh
cd domain
npx vitest
```

#### Backend

```sh
cd apps/backend
npx vitest
```

### 3. Levantar el backend

```sh
cd apps/backend
npm run dev
```

### 4. Levantar el frontend

```sh
cd apps/frontend
npm run dev
```

---

## 🧪 Testing

- Los tests unitarios de la lógica de negocio están en `domain/src/use-cases/*.spec.ts`.
- El backend también incluye tests en `apps/backend/src/**/*.spec.ts`.
- Se usa Vitest para pruebas y cobertura.
- Para TDD, primero escribe los tests en los casos de uso antes de implementar la lógica.

---

---

## 🚀 Características principales

- **Autenticación de usuarios** (Registro/Login con JWT)
- **Roles y permisos** (Admin/User)
- **CRUD de productos** (Solo para admins)
- **Carrito de compras**
- **API REST** con Express
- **Frontend** con React

---

## 🏗️ Estructura del proyecto (Monorepo)

```
📦 proyecto
├── 📁 apps/
│   ├── 📁 backend/
│   │   ├── 📁 src/
│   │   │   ├── 📁 controllers/
│   │   │   ├── 📁 data/
│   │   │   ├── 📁 database/
│   │   │   ├── 📁 errors/
│   │   │   ├── 📁 middlewares/
│   │   │   ├── 📁 routes/
│   │   │   ├── 📁 services/
│   │   │   ├── 📁 types/
│   │   │   └── 📄 app.ts
│   │   ├── 🔒 package-lock.json
│   │   ├── 📋 package.json
│   │   ├── 📄 tsconfig.json
│   │   └── ⚡ vitest.config.ts
│   └── 📁 frontend/
│       ├── 📁 .storybook/
│       ├── 📁 public/
│       ├── 📁 src/
│       │   ├── 📁 assets/
│       │   ├── 📁 components/
│       │   ├── 📁 context/
│       │   ├── 📁 hooks/
│       │   ├── 📁 layouts/
│       │   ├── 📁 pages/
│       │   ├── 📁 services/
│       │   ├── 📁 types/
│       │   ├── ⚛️ App.tsx
│       │   ├── 🎨 index.css
│       │   ├── ⚛️ main.tsx
│       │   └── 📄 vite-env.d.ts
│       ├── 🚫 .gitignore
│       ├── ⚙️ eslint.config.js
│       ├── 🌐 index.html
│       ├── 🔒 package-lock.json
│       ├── 📋 package.json
│       ├── ⚙️ postcss.config.js
│       ├── 📖 README.md
│       ├── 🎨 tailwind.config.js
│       ├── 📄 tsconfig.app.json
│       ├── 📄 tsconfig.json
│       ├── 📄 tsconfig.node.json
│       ├── ⚡ vite.config.ts
│       └── ⚡ vitest.shims.d.ts
└── 📁 domain/
    ├── 📁 src/
    │   ├── 📁 entities/
    │   ├── 📁 infrastructure/
    │   ├── 📁 mocks/
    │   ├── 📁 ports/
    │   ├── 📁 repositories/
    │   ├── 📁 use-cases/
    │   ├── 🔒 package-lock.json
    │   └── 📋 package.json
    ├── 🚫 .gitignore
    ├── 🔒 package-lock.json
    ├── 📋 package.json
    ├── 📖 README.md
    └── ⚡ vitest.config.ts
```

## 🏛️ Arquitectura

Dominio: Entidades, casos de uso y lógica de negocio desacoplada.
Backend: Implementa la API REST y conecta con el dominio.
Frontend: SPA en React que consume la API.
Arquitectura limpia: Separación clara entre capas, dependencias invertidas.

---

## 🔧 Tecnologías clave

| Área         | Tecnologías                                   |
| ------------ | --------------------------------------------- |
| Backend      | Node.js, Express, TypeScript, JWT             |
| Dominio      | Arquitectura limpia, TDD                      |
| Frontend     | React, TypeScript, TailwindCSS (Próximamente) |
| Herramientas | Git, GitHub, Postman, Vitest (Testing)        |

---

## 📜 **Licencia**

Proyecto educativo para **Academia ForIT 2025**
