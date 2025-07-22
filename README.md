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
mi-proyecto/
├── domain/ # Lógica de negocio pura
│ ├── entities/ # User, Product, Cart
│ └── use-cases/ # Casos de uso (UserRegister, AddToCart, etc.)
├── apps/
│ ├── backend/ # API REST (Express)
│ └── frontend/ # En desarrollo (React)
```

---

## 🔧 Tecnologías clave

| Área          | Tecnologías                                   |
| ------------- | --------------------------------------------- |
| Backend       | Node.js, Express, TypeScript, JWT             |
| Dominio       | Arquitectura limpia, TDD, DDD                 |
| Frontend      | React, TypeScript, TailwindCSS (Próximamente) |
| Base de datos | MongoDB/PostgreSQL (Implementación futura)    |
| Herramientas  | Git, GitHub, Postman, Vitest (Testing)        |

---

## 📜 **Licencia**

Proyecto educativo para **Academia ForIT 2025**
