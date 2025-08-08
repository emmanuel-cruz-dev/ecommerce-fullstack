import { type FC } from "react";
import { ProductCard } from "./ProductCard";
import type { ProductContainerProps } from "src/types/product";

export const ProductContainer: FC<ProductContainerProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <article className="flex items-center justify-center h-48">
        <p className="text-gray-500 text-lg">No se encontraron productos.</p>
      </article>
    );
  }

  return (
    <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </article>
  );
};
