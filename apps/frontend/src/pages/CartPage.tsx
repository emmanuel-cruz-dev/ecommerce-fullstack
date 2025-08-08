import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, removeFromCart, clearCart } from "../services/cart.service";
import { getProductsByIds } from "src/services/product.service";
import type { Cart } from "@domain/entities/Cart";
import type { Product } from "@domain/entities/Product";
import LoadingSpinner from "src/components/common/LoadingSpinner";
import { useAuth } from "src/hooks/useAuth";
import type { CombinedCartItem } from "src/types/cart";
import { useNavigate } from "react-router-dom";

export function CartPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

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

  const removeMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Error al eliminar el producto del carrito:", error);
      alert("No se pudo eliminar el producto del carrito.");
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onError: (error) => {
      console.error("Error al vaciar el carrito:", error);
      alert("No se pudo vaciar el carrito.");
    },
  });

  const subtotal = combinedData.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleRemoveClick = (productId: string) => {
    removeMutation.mutate(productId);
  };

  const handleClearCartClick = () => {
    clearCartMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        alert("¡El carrito ha sido vaciado!");
      },
    });
  };

  const handleCheckout = () => {
    clearCartMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        alert("¡Compra finalizada con éxito! El carrito ha sido vaciado.");
        navigate("/");
      },
    });
  };

  if (isAuthLoading || isCartLoading || isProductsLoading) {
    return <LoadingSpinner />;
  }

  if (isCartError || isProductsError) {
    return (
      <article className="container">
        <h1>Error</h1>
        <p>
          Hubo un problema al cargar el carrito. Por favor, inténtelo de nuevo
          más tarde.
        </p>
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

  if (!isAuthenticated) {
    return (
      <article className="container">
        <h1>Carrito</h1>
        <p>Por favor, inicia sesión para ver tu carrito.</p>
      </article>
    );
  }

  return (
    <article className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Tu Carrito</h1>
      {removeMutation.isPending && <p>Eliminando producto...</p>}
      {clearCartMutation.isPending && <p>Vaciando carrito...</p>}
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
                <button
                  className="w-full border border-black rounded-md bg-gray-100 hover:bg-gray-300 mt-2"
                  onClick={() => handleRemoveClick(item.id)}
                  disabled={removeMutation.isPending}
                >
                  Eliminar
                </button>
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
        <button
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md shadow-sm transition-colors duration-200 mt-3"
          onClick={handleClearCartClick}
          disabled={clearCartMutation.isPending || combinedData.length === 0}
        >
          Vaciar Carrito
        </button>
        <button
          className="mt-6 w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors text-lg"
          onClick={handleCheckout}
          disabled={clearCartMutation.isPending || combinedData.length === 0}
        >
          Finalizar Compra
        </button>
      </article>
    </article>
  );
}
