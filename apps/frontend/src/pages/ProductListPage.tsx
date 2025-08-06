import { type FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../services/product.service";
import { ProductContainer } from "../components/ui/ProductContainer";

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
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-500">Cargando productos...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-500">Error al cargar los productos.</p>
      </div>
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
