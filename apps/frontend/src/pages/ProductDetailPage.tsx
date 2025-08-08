import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AddToCartRequest } from "../../../backend/src/types/types";
import { getProductById } from "../services/product.service";
import { addToCart } from "src/services/cart.service";
import { useAuth } from "src/hooks/useAuth";

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId,
  });

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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      navigate("/login");
      return;
    }

    if (product && productId) {
      const requestData: AddToCartRequest = {
        productId: productId,
        productName: product.name,
        productPrice: product.price,
        quantity: 1,
      };
      mutate(requestData);
    }
  };

  if (isLoading) {
    return (
      <article className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-500">Cargando producto...</p>
      </article>
    );
  }

  if (isError || !product) {
    return (
      <article className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">Producto no encontrado o error.</p>
      </article>
    );
  }

  return (
    <article className="container mx-auto p-4 flex flex-col md:flex-row max-w-xl">
      <figure className="md:w-2/3">
        <img
          src={product.imageUrl || "https://via.placeholder.com/600x400"}
          alt={product.name}
          className="w-full rounded-lg shadow-md"
        />
      </figure>
      <aside className="md:w- md:pl-8 mt-4 md:mt-0">
        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
        <p className="mt-4 text-gray-600 text-lg">{product.description}</p>
        <p className="mt-4 text-2xl font-bold text-gray-900">
          ${product.price}
        </p>
        <p className="mt-2 text-gray-500">Stock disponible: {product.stock}</p>
        <button
          className="mt-6 bg-blue-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-600 transition-colors text-md"
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
        >
          {isAdding ? "Añadiendo..." : "Añadir al carrito"}
        </button>
      </aside>
    </article>
  );
}
