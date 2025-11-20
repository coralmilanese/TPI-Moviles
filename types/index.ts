export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface Imagen {
  id: number;
  titulo: string;
  categoria_id: number;
  autor: string;
  fecha_publicacion: string | null;
  descripcion: string;
  palabras_clave: string;
  filename: string;
  tipo: string;
  tama_bytes: number;
  creado_en: string;
  categoria: string;
  url: string;
  isFavorite?: boolean; // Indica si está en favoritos del usuario actual
}

export interface Favorito {
  id: number;
  imagen_id: number;
  creado_en: string;
  titulo?: string;
  url?: string;
}

export interface Comentario {
  id: number;
  contenido: string;
  usuario: string | null;
  creado_en: string;
  imagen_id?: number;
  usuario_id?: number;
  estado?: "pendiente" | "aprobado" | "rechazado";
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Obra {
  id: number;
  titulo: string;
  autor: string;
  categoria: string;
  descripcion: string;
  fecha_publicacion: string | null;
  palabras_clave: string | string[];
  url: string;
  filename?: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface BiometricCredentials {
  email: string;
  password: string;
}
