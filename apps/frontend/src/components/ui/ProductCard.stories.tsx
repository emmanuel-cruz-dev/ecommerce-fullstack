import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductCard } from "./ProductCard";
import type { Product } from "@domain/entities/Product";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "src/context/auth.context";

const queryClient = new QueryClient();

const meta: Meta<typeof ProductCard> = {
  component: ProductCard,
  title: "Components/ProductCard",
  decorators: [
    (Story) => (
      <Router>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider
            value={{
              isAuthenticated: true,
              user: null,
              token: "mock-token",
              login: () => Promise.resolve(),
              logout: () => {},
              register: () => Promise.resolve(),
              isLoading: false,
            }}
          >
            <Story />
          </AuthContext.Provider>
        </QueryClientProvider>
      </Router>
    ),
  ],
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

export const AddingToCart: Story = {
  args: {
    product: mockProduct,
  },
  parameters: {
    msw: {
      handlers: {
        post: {
          url: "/api/cart",
          delay: 1000,
          response: {
            payload: {
              items: [{ productId: "1", quantity: 1 }],
            },
          },
        },
      },
    },
  },
};
