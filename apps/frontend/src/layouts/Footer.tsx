export function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <article className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} ForIT Tienda. Todos los derechos
          reservados.
        </p>
      </article>
    </footer>
  );
}
