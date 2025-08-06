import api from "./api";

export const addToCart = async (productId: string) => {
  // TODO agregar token real
  const token = "MY_AUTH_TOKEN";

  const response = await api.post(
    `/cart/add`,
    { productId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};
