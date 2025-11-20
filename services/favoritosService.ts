import { config } from "@/config/env";

export interface Favorito {
  id: number;
  imagen_id: number;
  creado_en: string;
  titulo?: string;
  url?: string;
}

/**
 * Obtener todos los favoritos del usuario autenticado
 */
export const fetchFavoritos = async (token: string): Promise<Favorito[]> => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/favoritos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener favoritos");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching favoritos:", error);
    throw error;
  }
};

/**
 * Marcar una imagen como favorita
 */
export const addFavorito = async (
  token: string,
  imagen_id: number
): Promise<void> => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/favoritos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imagen_id }),
    });

    if (!response.ok) {
      throw new Error("Error al agregar favorito");
    }
  } catch (error) {
    console.error("Error adding favorito:", error);
    throw error;
  }
};

/**
 * Quitar una imagen de favoritos por imagen_id
 */
export const removeFavorito = async (
  token: string,
  imagen_id: number
): Promise<void> => {
  try {
    const response = await fetch(
      `${config.API_BASE_URL}/api/favoritos/imagen/${imagen_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar favorito");
    }
  } catch (error) {
    console.error("Error removing favorito:", error);
    throw error;
  }
};

/**
 * Toggle favorito: agregar si no existe, quitar si existe
 */
export const toggleFavorito = async (
  token: string,
  imagen_id: number,
  isFavorite: boolean
): Promise<void> => {
  if (isFavorite) {
    await removeFavorito(token, imagen_id);
  } else {
    await addFavorito(token, imagen_id);
  }
};
