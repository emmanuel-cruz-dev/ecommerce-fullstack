import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../services/product.service";
import type { FC } from "react";

export const ProductDetailPage: FC = () => {
  const { productId } = useParams<{ productId: string }>();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId,
  });

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
        <button className="mt-6 bg-blue-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-600 transition-colors text-md">
          Añadir al carrito
        </button>
      </aside>
    </article>
  );
};
