import type { FC } from "react";
import { Link } from "react-router-dom";

export const Navbar: FC = () => {
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
          <Link to="/profile" className="text-gray-300 hover:text-white">
            Mi Cuenta
          </Link>
        </div>
      </article>
    </nav>
  );
};
