import type { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";

export const Navbar: FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <article className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          ForIT Tienda
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">
            Productos
          </Link>
          <Link to="/cart" className="text-gray-300 hover:text-white">
            Carrito
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white"
            >
              Cerrar Sesión
            </button>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link to="/register" className="text-gray-300 hover:text-white">
                Registro
              </Link>
            </>
          )}
        </div>
      </article>
    </nav>
  );
};
