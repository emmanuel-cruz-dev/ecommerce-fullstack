import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <article className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-500">Cargando...</p>
      </article>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
