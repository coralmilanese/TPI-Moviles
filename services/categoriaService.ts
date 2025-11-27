import { config } from "@/config/env";

export const fetchCategorias = async () => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/categorias`);
    if (!response.ok) throw new Error("Error al cargar categorías");

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};
