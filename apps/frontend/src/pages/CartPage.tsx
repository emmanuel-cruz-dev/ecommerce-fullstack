import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "../services/cart.service";
import { getProductsByIds } from "src/services/product.service";
import type { Cart } from "@domain/entities/Cart";
import type { Product } from "@domain/entities/Product";
import { useAuth } from "src/context/auth.context";

interface CombinedCartItem extends Product {
  quantity: number;
}

export const CartPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const {
    data: cartData,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    enabled: isAuthenticated,
  });

  const productIds = cartData?.items?.map((item) => item.productId) || [];

  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useQuery<Product[]>({
    queryKey: ["productsInCart", productIds],
    queryFn: () => getProductsByIds(productIds),
    enabled: !!cartData && productIds.length > 0 && isAuthenticated,
  });

  const combinedData: CombinedCartItem[] =
    (cartData?.items
      .map((cartItem) => {
        const product = products?.find(
          (product) => product.id === cartItem.productId
        );

        if (product) {
          return { ...product, quantity: cartItem.quantity };
        }
        return null;
      })
      .filter(Boolean) as CombinedCartItem[]) || [];

  const subtotal = combinedData.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (isCartLoading || isProductsLoading) {
    return (
      <article className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-500">Cargando carrito...</p>
      </article>
    );
  }

  if (isCartError || isProductsError) {
    return (
      <article className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">Error al cargar el carrito.</p>
      </article>
    );
  }

  if (combinedData.length === 0) {
    return (
      <article className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Tu Carrito</h1>
        <p className="text-gray-600">Tu carrito está vacío.</p>
      </article>
    );
  }

  return (
    <article className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tu Carrito</h1>
      <article className="bg-white shadow-md rounded-lg p-6">
        <ul>
          {combinedData.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center py-4 border-b"
            >
              <div className="flex items-center">
                <img
                  src={item.imageUrl || "https://via.placeholder.com/64"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div>
                  <p className="text-lg font-semibold">{item.name}</p>
                  <p className="text-gray-500">Cantidad: {item.quantity}</p>
                </div>
              </div>
              <aside className="text-right">
                <p>Precio unitario: ${item.price}</p>
                <p className="font-semibold">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>
              </aside>
            </li>
          ))}
        </ul>
        <footer className="mt-6 pt-4 border-t-2 border-gray-200">
          <div className="flex justify-between items-center font-bold text-xl">
            <p>Total:</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
        </footer>
        <button className="mt-6 w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors text-lg">
          Finalizar Compra
        </button>
      </article>
    </article>
  );
};
