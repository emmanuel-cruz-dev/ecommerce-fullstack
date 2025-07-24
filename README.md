# 🛒 E-commerce Fullstack - Proyecto Academia ForIT

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)

Sistema de e-commerce desarrollado como proyecto final del curso de Programación Fullstack. Implementa arquitectura limpia, TDD y un monorepo con dominio separado.

---

## 🚀 Características principales

- **Autenticación de usuarios** (Registro/Login con JWT)
- **Roles y permisos** (Admin/User)
- **CRUD de productos** (Solo para admins)
- **Carrito de compras**
- **API REST** con Express
- **Frontend** (Próximamente con React)

---

## 🏗️ Estructura del proyecto (Monorepo)

```
📦 proyecto
├── 📁 apps/
│   ├── 📁 backend/
│   └── 📁 frontend/
├── 📁 domain/
│   ├── 📁 src/
│   │   ├── 📁 entities/
│   │   │   ├── 📄 Cart.ts
│   │   │   ├── 📄 Product.ts
│   │   │   └── 📄 User.ts
│   │   ├── 📁 repositories/
│   │   │   ├── 📄 cart-repository.ts
│   │   │   ├── 📄 product-repository.ts
│   │   │   └── 📄 user-repository.ts
│   │   └── 📁 use-cases/
│   │       ├── 📄 add-to-cart.ts
│   │       ├── 📄 create-product.ts
│   │       └── 📄 user-register.ts
│   ├── 📁 tests/
│   │   ├── 📁 mocks/
│   │   │   ├── 📄 cart-repository-mock.ts
│   │   │   ├── 📄 product-repository-mock.ts
│   │   │   └── 📄 user-repository-mock.ts
│   │   └── 📁 use-cases/
│   │       ├── 📄 add-to-cart.spec.ts
│   │       ├── 📄 create-product.spec.ts
│   │       └── 📄 user-register.spec.ts
│   ├── 📄 package.json
│   ├── 📄 package-lock.json
│   └── ⚡ vitest.config.ts
├── 📁 node_modules/
├── 📄 .gitignore
├── 📄 package.json
├── 📄 package-lock.json
└── 📄 README.md
```

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
