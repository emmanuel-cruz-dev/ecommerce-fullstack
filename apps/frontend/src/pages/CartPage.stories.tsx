import type { Meta, StoryObj } from "@storybook/react-vite";
import { CartPage } from "./CartPage";
import { MemoryRouter } from "react-router-dom";
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

const mockProducts = [
  {
    id: "1",
    name: "Laptop Gamer",
    price: 1500,
    description: "Laptop de alto rendimiento",
    stock: 10,
    category: "Electronics",
    imageUrl:
      "https://www.acerstore.cl/cdn/shop/files/1_PNR-0988.jpg?v=1748957971&width=533",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Smartphone X",
    price: 800,
    description: "El último smartphone del mercado",
    stock: 5,
    category: "Electronics",
    imageUrl:
      "https://image.made-in-china.com/202f0j00kvdiStBcLCfl/Global-X200-4G-LTE-Android-Smartphone-6-5-Inch-Unlocked-Quad-Core-Cell-Phone-Low-Price-3G-4G-Features.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockCart = {
  items: [
    { productId: "1", quantity: 1 },
    { productId: "2", quantity: 2 },
  ],
};

const meta: Meta<typeof CartPage> = {
  component: CartPage,
  title: "Pages/CartPage",
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/cart"]}>
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
            <Story />
          </AuthContext.Provider>
        </QueryClientProvider>
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CartPage>;

export const FilledCart: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/cart", () => {
          console.log("MSW: FilledCart - intercepted cart request");
          return HttpResponse.json({ payload: mockCart });
        }),
        http.get("/api/products", ({ request }) => {
          console.log("MSW: FilledCart - intercepted products request");
          const url = new URL(request.url);
          const ids = url.searchParams.get("ids");
          console.log(`Requested product IDs: ${ids}`);
          return HttpResponse.json({ payload: mockProducts });
        }),
        http.get("http://localhost:3000/api/cart", () => {
          console.log("MSW: FilledCart - intercepted absolute cart request");
          return HttpResponse.json({ payload: mockCart });
        }),
        http.get("http://localhost:3000/api/products", ({ request }) => {
          console.log(
            "MSW: FilledCart - intercepted absolute products request"
          );
          const url = new URL(request.url);
          const ids = url.searchParams.get("ids");
          console.log(`Requested product IDs (absolute): ${ids}`);
          return HttpResponse.json({ payload: mockProducts });
        }),
      ],
    },
  },
};

export const EmptyCart: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/cart", () => {
          console.log("MSW: EmptyCart - intercepted cart request");
          return HttpResponse.json({ payload: { items: [] } });
        }),
        http.get("http://localhost:3000/api/cart", () => {
          console.log("MSW: EmptyCart - intercepted absolute cart request");
          return HttpResponse.json({ payload: { items: [] } });
        }),
      ],
    },
  },
};

export const LoadingState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/cart", async () => {
          console.log("MSW: LoadingState - delaying cart request...");
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return HttpResponse.json({ payload: mockCart });
        }),
        http.get("http://localhost:3000/api/cart", async () => {
          console.log("MSW: LoadingState - delaying absolute cart request...");
          await new Promise((resolve) => setTimeout(resolve, 10000));
          return HttpResponse.json({ payload: mockCart });
        }),
      ],
    },
  },
};

export const ErrorState: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/cart", () => {
          console.log("MSW: ErrorState - returning 500 error");
          return HttpResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
          );
        }),
        http.get("http://localhost:3000/api/cart", () => {
          console.log("MSW: ErrorState - returning 500 error (absolute)");
          return HttpResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
          );
        }),
      ],
    },
  },
};
