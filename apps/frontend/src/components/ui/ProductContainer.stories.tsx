import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Product } from "@domain/entities/Product";
import { ProductContainer } from "./ProductContainer";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "src/context/auth.context";

const queryClient = new QueryClient();

const meta: Meta<typeof ProductContainer> = {
  component: ProductContainer,
  title: "Components/ProductGrid",
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

type Story = StoryObj<typeof ProductContainer>;

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Laptop Gamer Pro",
    description: "Una laptop de alto rendimiento para gaming.",
    price: 1500,
    stock: 10,
    imageUrl:
      "https://www.acerstore.cl/cdn/shop/files/1_PNR-0988.jpg?v=1748957971&width=533",
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
    imageUrl:
      "https://image.made-in-china.com/202f0j00kvdiStBcLCfl/Global-X200-4G-LTE-Android-Smartphone-6-5-Inch-Unlocked-Quad-Core-Cell-Phone-Low-Price-3G-4G-Features.jpg",
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
    imageUrl:
      "https://noblex.com.ar/media/catalog/product/cache/c8f6a96bef9e9f64cd4973587df2520f/n/b/nbx_pop_digital_1200x922_mesa_de_trabajo_1_copia_2_1.jpg",
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
    imageUrl:
      "https://cdn.v2.tiendanegocio.com/gallery/31960/img_31960_2u2lax7lflm7vgnku3.jpeg",
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
