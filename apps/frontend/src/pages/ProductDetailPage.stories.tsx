import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductDetailPage } from "./ProductDetailPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "src/context/auth.context";
import { http, HttpResponse } from "msw";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

const mockProduct = {
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

const meta: Meta<typeof ProductDetailPage> = {
  component: ProductDetailPage,
  title: "Pages/ProductDetailPage",
  decorators: [
    (Story, context) => {
      const productId =
        context.parameters?.reactRouter?.routeParams?.productId || "1";

      return (
        <QueryClientProvider client={createQueryClient()}>
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
            <MemoryRouter initialEntries={[`/products/${productId}`]}>
              <Routes>
                <Route path="/products/:productId" element={<Story />} />
              </Routes>
            </MemoryRouter>
          </AuthContext.Provider>
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    reactRouter: {
      routePath: "/products/:productId",
      routeParams: { productId: "1" },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProductDetailPage>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/products/:productId", ({ params }) => {
          const { productId } = params;
          console.log("MSW intercepted relative URL for productId:", productId);
          if (productId === mockProduct.id) {
            return HttpResponse.json({ payload: mockProduct });
          }
          return HttpResponse.json(
            { error: "Product not found" },
            { status: 404 }
          );
        }),
        http.get(
          "http://localhost:3000/api/products/:productId",
          ({ params }) => {
            const { productId } = params;
            console.log(
              "MSW intercepted absolute URL for productId:",
              productId
            );
            if (productId === mockProduct.id) {
              return HttpResponse.json({ payload: mockProduct });
            }
            return HttpResponse.json(
              { error: "Product not found" },
              { status: 404 }
            );
          }
        ),
      ],
    },
    reactRouter: {
      routePath: "/products/:productId",
      routeParams: { productId: "1" },
    },
  },
};

export const LoadingState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/products/:productId", async () => {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return HttpResponse.json({ payload: mockProduct });
        }),
      ],
    },
    reactRouter: {
      routePath: "/products/:productId",
      routeParams: { productId: "1" },
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/products/:productId", () => {
          return new HttpResponse("Internal Server Error", { status: 500 });
        }),
      ],
    },
    reactRouter: {
      routePath: "/products/:productId",
      routeParams: { productId: "1" },
    },
  },
};

export const ProductNotFound: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/products/:productId", () => {
          return new HttpResponse("Product not found", { status: 404 });
        }),
      ],
    },
    reactRouter: {
      routePath: "/products/:productId",
      routeParams: { productId: "999" },
    },
  },
};
