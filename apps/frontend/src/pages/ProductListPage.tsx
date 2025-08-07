import { type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/product.service";
import { ProductContainer } from "../components/ui/ProductContainer";
import LoadingSpinner from "src/components/common/LoadingSpinner";

export const ProductListPage: FC = () => {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <article className="container">
        <h1>Error</h1>
        <p>
          Hubo un problema al cargar los productos. Por favor, inténtelo de
          nuevo más tarde.
        </p>
      </article>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Nuestros Productos
      </h1>
      <ProductContainer products={products || []} />
    </div>
  );
};
