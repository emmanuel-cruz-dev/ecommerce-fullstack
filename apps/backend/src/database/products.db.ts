import { Product } from "@domain/src/entities/Product";

export let productsDB: Product[] = [
  {
    id: "prod-001",
    name: "Smartphone X200",
    description: "Último modelo con cámara de 108MP y pantalla AMOLED",
    price: 799.99,
    stock: 50,
    category: "Electrónicos",
    imageUrl: "https://ejemplo.com/images/x200.jpg",
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2023-11-20"),
  },
  {
    id: "prod-002",
    name: "Zapatillas Runner Pro",
    description: "Zapatillas deportivas con amortiguación de aire",
    price: 129.99,
    stock: 120,
    category: "Deportes",
    imageUrl: "https://ejemplo.com/images/runnerpro.jpg",
    createdAt: new Date("2023-09-01"),
    updatedAt: new Date("2023-10-10"),
  },
  {
    id: "prod-003",
    name: "Libro 'Aprendiendo TypeScript'",
    description: "Guía completa para dominar TypeScript desde cero",
    price: 29.99,
    stock: 200,
    category: "Libros",
    createdAt: new Date("2023-11-05"),
    updatedAt: new Date("2023-11-05"),
  },
];
