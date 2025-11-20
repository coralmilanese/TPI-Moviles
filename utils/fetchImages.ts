import { config } from "@/config/env";
import { Imagen } from "@/types";

export const fetchImages = async () => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/imagenes`);
    const data = await response.json();

    if (data && Array.isArray(data)) {
      // Reemplazar localhost con la IP en las URLs
      const imagesWithFixedUrls = data.map((img: Imagen) => ({
        ...img,
        url: img.url.replace("http://localhost:4000", config.API_BASE_URL),
      }));
      return imagesWithFixedUrls;
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};
