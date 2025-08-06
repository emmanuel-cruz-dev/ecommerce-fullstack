import { type FC } from "react";
import type { Product } from "@domain/entities/Product";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 max-w-sm">
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
        <button className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-colors">
          Añadir al carrito
        </button>
      </div>
    </article>
  );
};
