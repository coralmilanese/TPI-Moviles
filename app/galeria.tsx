import { HamburgerMenu } from '@/components/menu/HamburgerMenu';
import { ThemeToggle } from '@/components/menu/ThemeToggle';
import { config } from '@/config/env';
import { useTheme } from '@/contexts/ThemeContext';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const imageWidth = (width - 48) / 2;

interface Imagen {
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
}

export default function GalleryScreen() {
    const { effectiveTheme } = useTheme();
    const isDark = effectiveTheme === 'dark';
    const [images, setImages] = useState<Imagen[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch(`${config.API_BASE_URL}/api/imagenes`);

            if (!response.ok) {
                throw new Error('Error al cargar las imágenes');
            }

            const data = await response.json();

            // Reemplazar localhost en las URLs por la IP del servidor
            const imagesWithFixedUrls = data.map((img: Imagen) => ({
                ...img,
                url: img.url.replace('http://localhost:4000', config.API_BASE_URL)
            }));

            setImages(imagesWithFixedUrls);
        } catch (err) {
            console.error('Error fetching images:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <View style={[styles.header, isDark && styles.headerDark]}>
                <HamburgerMenu />
                <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Galería</Text>
                <ThemeToggle />
            </View>

            {isLoading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={isDark ? '#e5e5e5' : '#1a1a1a'} />
                    <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>Cargando galería...</Text>
                </View>
            ) : error ? (
                <View style={styles.centerContent}>
                    <Text style={[styles.errorText, isDark && styles.errorTextDark]}>❌ {error}</Text>
                </View>
            ) : images.length === 0 ? (
                <View style={styles.centerContent}>
                    <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>No hay imágenes disponibles</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>Explora nuestra colección digital</Text>
                    <View style={styles.gallery}>
                        {images.map((item) => (
                            <View key={item.id} style={[styles.imageCard, isDark && styles.imageCardDark]}>
                                <Image
                                    source={{ uri: item.url }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                                <View style={styles.imageInfo}>
                                    <Text style={[styles.imageTitle, isDark && styles.imageTitleDark]} numberOfLines={1}>
                                        {item.titulo}
                                    </Text>
                                    <Text style={[styles.imageArtist, isDark && styles.imageArtistDark]} numberOfLines={1}>
                                        {item.autor}
                                    </Text>
                                    <Text style={[styles.imageCategory, isDark && styles.imageCategoryDark]} numberOfLines={1}>
                                        {item.categoria}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    containerDark: {
        backgroundColor: '#0a0a0a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerDark: {
        backgroundColor: 'transparent',
        borderBottomColor: '#2a2a2a',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '300',
        color: '#1a1a1a',
        letterSpacing: 1,
    },
    headerTitleDark: {
        color: '#e5e5e5',
    },
    subtitle: {
        fontSize: 15,
        color: '#757575',
        fontWeight: '300',
        marginBottom: 20,
    },
    subtitleDark: {
        color: '#999',
    },
    scrollContent: {
        padding: 20,
    },
    gallery: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    imageCard: {
        width: imageWidth,
        marginBottom: 20,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    imageCardDark: {
        backgroundColor: '#1a1a1a',
        borderColor: '#2a2a2a',
    },
    image: {
        width: '100%',
        height: imageWidth * 1.2,
        backgroundColor: '#f0f0f0',
    },
    imageInfo: {
        padding: 16,
    },
    imageTitle: {
        fontSize: 14,
        fontWeight: '400',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    imageTitleDark: {
        color: '#e5e5e5',
    },
    imageArtist: {
        fontSize: 12,
        color: '#999',
        fontWeight: '300',
        marginBottom: 4,
    },
    imageArtistDark: {
        color: '#666',
    },
    imageCategory: {
        fontSize: 11,
        color: '#999',
        fontWeight: '300',
        fontStyle: 'italic',
    },
    imageCategoryDark: {
        color: '#666',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: '#757575',
        fontWeight: '300',
    },
    loadingTextDark: {
        color: '#999',
    },
    errorText: {
        fontSize: 14,
        color: '#d32f2f',
        fontWeight: '300',
        textAlign: 'center',
    },
    errorTextDark: {
        color: '#f44336',
    },
    emptyText: {
        fontSize: 14,
        color: '#757575',
        fontWeight: '300',
    },
    emptyTextDark: {
        color: '#999',
    },
});