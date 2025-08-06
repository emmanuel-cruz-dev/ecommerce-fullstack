import { Product } from "@domain/src/entities/Product";

export let productsDB: Product[] = [
  {
    id: "prod-001",
    name: "Smartphone X200",
    description: "Último modelo con cámara de 108MP y pantalla AMOLED",
    price: 799.99,
    stock: 50,
    category: "Electrónicos",
    imageUrl:
      "https://image.made-in-china.com/202f0j00kvdiStBcLCfl/Global-X200-4G-LTE-Android-Smartphone-6-5-Inch-Unlocked-Quad-Core-Cell-Phone-Low-Price-3G-4G-Features.jpg",
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
    imageUrl:
      "https://production.cdn.vaypol.com/variants/lyir18yoi2hxj2nc0wbongx1n1ue/e82c8d6171dd25bb538f2e7263b5bc7dfc6a79352d85923074be76df53fbc6f4",
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
    imageUrl:
      "https://http2.mlstatic.com/D_NQ_NP_940308-CBT80177466871_102024-O.webp",
    createdAt: new Date("2023-11-05"),
    updatedAt: new Date("2023-11-05"),
  },
  {
    id: "prod-004",
    name: "Laptop Gamer",
    description: "Potente laptop para gaming y diseño.",
    price: 1500,
    stock: 10,
    category: "Electronics",
    imageUrl:
      "https://www.acerstore.cl/cdn/shop/files/1_PNR-0988.jpg?v=1748957971&width=533",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
