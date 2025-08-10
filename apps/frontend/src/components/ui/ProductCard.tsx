import { type FC } from "react";
import { Link } from "react-router-dom";
import type { ProductCardProps } from "src/types/product";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "src/services/cart.service";
import { useAuth } from "src/hooks/useAuth";
import type { AddToCartRequest } from "@backend-types/types";

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { mutate, isPending: isAdding } = useMutation({
    mutationFn: (data: AddToCartRequest) => addToCart(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      alert("Producto añadido al carrito!");
    },
    onError: (error) => {
      console.error("Error al añadir al carrito", error);
      alert("Error al añadir al carrito. Revisa la consola.");
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      return;
    }

    if (product) {
      const requestData: AddToCartRequest = {
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity: 1,
      };
      mutate(requestData);
    }
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 max-w-sm"
    >
      <figure className="w-32 h-40 mx-auto">
        <img
          className="w-full h-full object-cover"
          src={product.imageUrl || "https://via.placeholder.com/150"}
          alt={product.name}
        />
      </figure>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="mt-1 text-gray-600">{product.description}</p>
        <p className="mt-2 text-xl font-bold text-gray-900">${product.price}</p>
        {isAuthenticated && (
          <button
            className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
          >
            {isAdding ? "Añadiendo..." : "Añadir al carrito"}
          </button>
        )}
      </div>
    </Link>
  );
};
