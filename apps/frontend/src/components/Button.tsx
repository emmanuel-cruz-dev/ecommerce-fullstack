import type { PropsWithChildren } from "react";
import "../index.css";

export type ButtonProps = PropsWithChildren<{
  variant?: "default" | "abort" | "confirm";
}>;

export function Button({ children, variant }: ButtonProps) {
  let variantClass = "";
  switch (variant) {
    case "abort":
      variantClass = "bg-red-500 text-white hover:bg-red-600";
      break;
    case "confirm":
      variantClass = "bg-green-500 text-white hover:bg-green-600";
      break;
    default:
      variantClass = "bg-gray-200 text-black hover:bg-gray-300";
      break;
  }
  return (
    <button className={`btn btn-primary border p-2 rounded-md ${variantClass}`}>
      {children}
    </button>
  );
}

export default Button;
