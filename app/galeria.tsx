import { HamburgerMenu } from '@/components/menu/HamburgerMenu';
import { ThemeToggle } from '@/components/menu/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { fetchFavoritos, toggleFavorito } from '@/services/favoritosService';
import type { Imagen } from '@/types';
import { fetchImages } from '@/utils/fetchImages';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const imageWidth = (width - 48) / 2;

export default function GalleryScreen() {
    const { effectiveTheme } = useTheme();
    const { isAuthenticated, token } = useAuth();
    const router = useRouter();
    const isDark = effectiveTheme === 'dark';
    const [images, setImages] = useState<Imagen[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [favoritosIds, setFavoritosIds] = useState<Set<number>>(new Set());
    const [togglingFavorite, setTogglingFavorite] = useState<number | null>(null);

    const loadData = async () => {
        setIsLoading(true);
        try {
            // Cargar imágenes
            const fetchedImages = await fetchImages();

            if (!fetchedImages) {
                setError('No se pudieron cargar las imágenes');
                return;
            }

            // Cargar favoritos si el usuario está autenticado
            if (isAuthenticated && token) {
                try {
                    const favoritos = await fetchFavoritos(token);
                    const favIds = new Set(favoritos.map(f => f.imagen_id));
                    setFavoritosIds(favIds);

                    // Marcar imágenes favoritas
                    const imagesWithFavorites = fetchedImages.map(img => ({
                        ...img,
                        isFavorite: favIds.has(img.id),
                    }));
                    setImages(imagesWithFavorites);
                } catch (error) {
                    console.error('Error loading favoritos:', error);
                    setImages(fetchedImages);
                }
            } else {
                setImages(fetchedImages);
            }
        } catch (err) {
            console.error('Error fetching images:', err);
            setError('Error al cargar la galería. Por favor, intenta nuevamente más tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar imágenes y favoritos
    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, token]);

    const handleToggleFavorite = async (imagen_id: number, currentIsFavorite: boolean) => {
        if (!isAuthenticated || !token) {
            Alert.alert('Inicia sesión', 'Debes iniciar sesión para agregar favoritos');
            return;
        }

        setTogglingFavorite(imagen_id);
        try {
            await toggleFavorito(token, imagen_id, currentIsFavorite);

            // Actualizar estado local
            const newFavoritosIds = new Set(favoritosIds);
            if (currentIsFavorite) {
                newFavoritosIds.delete(imagen_id);
            } else {
                newFavoritosIds.add(imagen_id);
            }
            setFavoritosIds(newFavoritosIds);

            // Actualizar imágenes
            setImages(prevImages =>
                prevImages.map(img =>
                    img.id === imagen_id
                        ? { ...img, isFavorite: !currentIsFavorite }
                        : img
                )
            );
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el favorito');
            console.error('Error toggling favorito:', error);
        } finally {
            setTogglingFavorite(null);
        }
    };

    const filteredImages = useMemo(() => {
        if (!searchQuery.trim()) {
            // Ordenar: favoritos primero
            return [...images].sort((a, b) => {
                if (a.isFavorite && !b.isFavorite) return -1;
                if (!a.isFavorite && b.isFavorite) return 1;
                return 0;
            });
        }

        const query = searchQuery.toLowerCase().trim();

        const filtered = images.filter((image) => {
            const searchableFields = [
                image.titulo,
                image.autor,
                image.categoria,
                image.descripcion,
                image.palabras_clave,
                image.id?.toString(),
            ];

            return searchableFields.some((field) =>
                field?.toLowerCase().includes(query)
            );
        });

        // Ordenar resultados filtrados: favoritos primero
        return filtered.sort((a, b) => {
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            return 0;
        });
    }, [images, searchQuery]);

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <View style={[styles.header, isDark && styles.headerDark]}>
                <HamburgerMenu />
                <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Galería</Text>
                <ThemeToggle />
            </View>

            <View style={[styles.searchContainer, isDark && styles.searchContainerDark]}>
                <MaterialIcons
                    name="search"
                    size={20}
                    color={isDark ? '#666' : '#999'}
                    style={styles.searchIcon}
                />
                <TextInput
                    style={[styles.searchInput, isDark && styles.searchInputDark]}
                    placeholder="Buscar por título, autor, categoría..."
                    placeholderTextColor={isDark ? '#666' : '#999'}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setSearchQuery('')}
                        style={styles.clearButton}
                    >
                        <MaterialIcons
                            name="close"
                            size={20}
                            color={isDark ? '#666' : '#999'}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {isLoading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={isDark ? '#e5e5e5' : '#1a1a1a'} />
                    <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>Cargando galería...</Text>
                </View>
            ) : error ? (
                <View style={styles.centerContent}>
                    <Text style={[styles.errorText, isDark && styles.errorTextDark]}>{error}</Text>
                </View>
            ) : filteredImages.length === 0 ? (
                <View style={styles.centerContent}>
                    <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                        {searchQuery ? 'No se encontraron resultados' : 'No hay imágenes disponibles'}
                    </Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.subtitleContainer}>
                        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
                            {searchQuery
                                ? `${filteredImages.length} resultado${filteredImages.length !== 1 ? 's' : ''}`
                                : 'Explora nuestra colección digital'
                            }
                        </Text>
                    </View>
                    <View style={styles.gallery}>
                        {filteredImages.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.imageCard, isDark && styles.imageCardDark]}
                                onPress={() => {
                                    const encodedData = encodeURIComponent(JSON.stringify(item));
                                    router.push(`/imagenDetalle?data=${encodedData}`);
                                }}
                                activeOpacity={0.7}
                            >
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: item.url }}
                                        style={styles.image}
                                        resizeMode="cover"
                                    />
                                    {isAuthenticated && (
                                        <TouchableOpacity
                                            style={[styles.favoriteButton, isDark && styles.favoriteButtonDark]}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                handleToggleFavorite(item.id, !!item.isFavorite);
                                            }}
                                            disabled={togglingFavorite === item.id}
                                        >
                                            <MaterialIcons
                                                name={item.isFavorite ? 'favorite' : 'favorite-border'}
                                                size={24}
                                                color={item.isFavorite ? '#ff4444' : (isDark ? '#e5e5e5' : '#1a1a1a')}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
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
                            </TouchableOpacity>
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 8,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    searchContainerDark: {
        backgroundColor: '#1a1a1a',
        borderColor: '#2a2a2a',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: '300',
        color: '#1a1a1a',
        padding: 0,
    },
    searchInputDark: {
        color: '#e5e5e5',
    },
    clearButton: {
        padding: 4,
        marginLeft: 8,
    },
    subtitleContainer: {
        marginBottom: 20,
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
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: imageWidth * 1.2,
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    favoriteButtonDark: {
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
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