import type { Meta, StoryObj } from "@storybook/react";
import type { Product } from "@domain/entities/Product";
import { ProductContainer } from "./ProductContainer";

const meta: Meta<typeof ProductContainer> = {
  component: ProductContainer,
  title: "Components/ProductGrid",
};

export default meta;

type Story = StoryObj<typeof ProductContainer>;

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Laptop Gamer Pro",
    description: "Una laptop de alto rendimiento para gaming.",
    price: 1500,
    stock: 10,
    category: "Electronics",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Smartphone X",
    description: "El nuevo teléfono con la mejor cámara.",
    price: 800,
    stock: 5,
    category: "Electronics",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Teclado Mecánico RGB",
    description: "Teclado con switches de alta durabilidad.",
    price: 120,
    stock: 0,
    category: "Peripherals",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Mouse Ergonómico",
    description: "Diseñado para largas sesiones de trabajo.",
    price: 50,
    stock: 25,
    category: "Peripherals",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const WithProducts: Story = {
  args: {
    products: mockProducts,
  },
};

export const WithoutProducts: Story = {
  args: {
    products: [],
  },
};

export const LoadingState: Story = {
  args: {
    products: undefined,
  },
};
