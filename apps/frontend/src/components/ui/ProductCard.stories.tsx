import type { Meta, StoryObj } from "@storybook/react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@domain/entities/Product";

const meta: Meta<typeof ProductCard> = {
  component: ProductCard,
  title: "Components/ProductCard",
};

export default meta;

type Story = StoryObj<typeof ProductCard>;

const mockProduct: Product = {
  id: "1",
  name: "Laptop Gamer",
  description: "Potente laptop para gaming y diseño.",
  price: 1500,
  stock: 10,
  category: "Electronics",
  imageUrl:
    "https://www.acerstore.cl/cdn/shop/files/1_PNR-0988.jpg?v=1748957971&width=533",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const Default: Story = {
  args: {
    product: mockProduct,
  },
};

export const OutOfStock: Story = {
  args: {
    product: {
      ...mockProduct,
      name: "Laptop Gamer (Sin Stock)",
      stock: 0,
    },
  },
};
