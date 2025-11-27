import { Button } from '@/components/common/Button';
import { InputField } from '@/components/forms/InputField';
import { HamburgerMenu } from '@/components/menu/HamburgerMenu';
import { ThemeToggle } from '@/components/menu/ThemeToggle';
import { config } from '@/config/env';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { Categoria } from '@/types';
import { fetchCategorias } from '@/utils/fetchCategorias';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UploadScreen() {
    const { isAuthenticated } = useAuth();
    const { effectiveTheme } = useTheme();
    const isDark = effectiveTheme === 'dark';
    const router = useRouter();
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [autor, setAutor] = useState('');
    const [palabrasClave, setPalabrasClave] = useState('');
    const [categoriaId, setCategoriaId] = useState<string>('');
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCategorias, setIsLoadingCategorias] = useState(true);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    useEffect(() => {
        setIsLoadingCategorias(true);
        fetchCategorias().then(data => {
            if (data) {
                setCategorias(data);
            }
            setIsLoadingCategorias(false);
        });
    }, [isAuthenticated, router]);

    const elegirImagen = async () => {
        try {
            // Solicitar permisos
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para seleccionar imágenes');
                return;
            }

            // Abrir selector de imágenes
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setImageUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error al seleccionar imagen:', error);
            Alert.alert('Error', 'No se pudo seleccionar la imagen');
        }
    };

    const handleUpload = async () => {
        if (!titulo.trim()) {
            Alert.alert('Error', 'Por favor ingresa un título');
            return;
        }

        if (!imageUri) {
            Alert.alert('Error', 'Por favor selecciona una imagen');
            return;
        }

        if (!categoriaId) {
            Alert.alert('Error', 'Por favor selecciona una categoría');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();

            // Extraer nombre y tipo de archivo
            const filename = imageUri.split('/').pop() || 'image.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('imagen', {
                uri: imageUri,
                name: filename,
                type: type,
            } as any);

            formData.append('titulo', titulo);
            formData.append('categoria_id', categoriaId);
            if (autor.trim()) formData.append('autor', autor);
            if (descripcion.trim()) formData.append('descripcion', descripcion);
            if (palabrasClave.trim()) formData.append('palabras_clave', palabrasClave);

            const response = await fetch(`${config.API_BASE_URL}/api/imagenes`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                throw new Error('Error al subir la imagen');
            }

            Alert.alert(
                'Éxito',
                'La imagen se ha subido correctamente',
                [
                    {
                        text: 'Ver Galería',
                        onPress: () => router.push('/(tabs)/galeria'),
                    },
                ]
            );

            // Limpiar formulario
            setTitulo('');
            setDescripcion('');
            setAutor('');
            setPalabrasClave('');
            setCategoriaId('');
            setImageUri(null);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'No se pudo subir la imagen');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <View style={[styles.header, isDark && styles.headerDark]}>
                <HamburgerMenu />
                <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Subir Obra</Text>
                <ThemeToggle />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.headerSection, isDark && styles.headerSectionDark]}>
                    <Text style={[styles.title, isDark && styles.titleDark]}>Subir Obra de Arte</Text>
                </View>

                <View style={[styles.formContainer, isDark && styles.formContainerDark]}>
                    <TouchableOpacity
                        style={[styles.imagePickerButton, isDark && styles.imagePickerButtonDark]}
                        onPress={elegirImagen}
                    >
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Ionicons
                                    name="camera-outline"
                                    size={48}
                                    color={isDark ? '#666' : '#999'}
                                    style={styles.placeholderIcon}
                                />
                                <Text style={[styles.placeholderText, isDark && styles.placeholderTextDark]}>
                                    Seleccionar una imagen
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <InputField
                        label="Título de la obra *"
                        value={titulo}
                        onChangeText={setTitulo}
                        placeholder="Ej: Atardecer en el campo"
                    />

                    <InputField
                        label="Autor"
                        value={autor}
                        onChangeText={setAutor}
                        placeholder="Nombre del autor"
                    />

                    {isLoadingCategorias ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color={isDark ? '#e5e5e5' : '#1a1a1a'} />
                            <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
                                Cargando categorías...
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.fieldContainer}>
                            <Text style={[styles.label, isDark && styles.labelDark]}>Categoría *</Text>
                            <TouchableOpacity
                                style={[styles.dropdown, isDark && styles.dropdownDark]}
                                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            >
                                <Text style={[styles.dropdownText, isDark && styles.dropdownTextDark]}>
                                    {categoriaId
                                        ? categorias.find(cat => cat.id.toString() === categoriaId)?.nombre
                                        : 'Selecciona una categoría'
                                    }
                                </Text>
                                <Ionicons
                                    name={showCategoryDropdown ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={isDark ? '#999' : '#666'}
                                />
                            </TouchableOpacity>

                            {showCategoryDropdown && (
                                <View style={[styles.dropdownList, isDark && styles.dropdownListDark]}>
                                    {categorias.map((cat) => (
                                        <TouchableOpacity
                                            key={cat.id}
                                            style={[
                                                styles.dropdownItem,
                                                isDark && styles.dropdownItemDark,
                                                categoriaId === cat.id.toString() && styles.dropdownItemSelected,
                                            ]}
                                            onPress={() => {
                                                setCategoriaId(cat.id.toString());
                                                setShowCategoryDropdown(false);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.dropdownItemText,
                                                    isDark && styles.dropdownItemTextDark,
                                                    categoriaId === cat.id.toString() && styles.dropdownItemTextSelected,
                                                ]}
                                            >
                                                {cat.nombre}
                                            </Text>
                                            {categoriaId === cat.id.toString() && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={20}
                                                    color={isDark ? '#e5e5e5' : '#1a1a1a'}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}

                    <InputField
                        label="Descripción"
                        value={descripcion}
                        onChangeText={setDescripcion}
                        placeholder="Describe tu obra..."
                    />

                    <InputField
                        label="Palabras clave"
                        value={palabrasClave}
                        onChangeText={setPalabrasClave}
                        placeholder="Ej: naturaleza, paisaje, atardecer"
                    />

                    <Button
                        title="Subir Imagen"
                        onPress={handleUpload}
                        loading={isLoading}
                        style={styles.uploadButton}
                    />

                    <Button
                        title="Cancelar"
                        onPress={() => router.back()}
                        variant="secondary"
                        style={styles.cancelButton}
                    />
                </View>
            </ScrollView>
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
    scrollContent: {
        padding: 32,
    },
    headerSection: {
        marginBottom: 32,
    },
    headerSectionDark: {
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 28,
        fontWeight: '200',
        color: '#1a1a1a',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    titleDark: {
        color: '#e5e5e5',
    },
    subtitle: {
        fontSize: 15,
        color: '#757575',
        fontWeight: '300',
    },
    subtitleDark: {
        color: '#999',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 28,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    formContainerDark: {
        backgroundColor: '#1a1a1a',
        borderColor: '#2a2a2a',
    },
    imagePickerButton: {
        width: '100%',
        height: 250,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 24,
        backgroundColor: '#fafafa',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
    },
    imagePickerButtonDark: {
        backgroundColor: '#0a0a0a',
        borderColor: '#2a2a2a',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderIcon: {
        marginBottom: 12,
        opacity: 0.5,
    },
    placeholderText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        fontWeight: '300',
    },
    placeholderTextDark: {
        color: '#666',
    },
    uploadButton: {
        marginTop: 8,
    },
    cancelButton: {
        marginTop: 12,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: '#757575',
        fontWeight: '300',
    },
    loadingTextDark: {
        color: '#999',
    },
    fieldContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '400',
        color: '#1a1a1a',
        marginBottom: 12,
        letterSpacing: 0.3,
    },
    labelDark: {
        color: '#e5e5e5',
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    dropdownDark: {
        backgroundColor: '#1a1a1a',
        borderColor: '#2a2a2a',
    },
    dropdownText: {
        fontSize: 14,
        color: '#1a1a1a',
        fontWeight: '300',
        flex: 1,
    },
    dropdownTextDark: {
        color: '#e5e5e5',
    },
    dropdownList: {
        marginTop: 8,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        maxHeight: 200,
    },
    dropdownListDark: {
        backgroundColor: '#1a1a1a',
        borderColor: '#2a2a2a',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemDark: {
        borderBottomColor: '#2a2a2a',
    },
    dropdownItemSelected: {
        backgroundColor: '#fafafa',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#1a1a1a',
        fontWeight: '300',
    },
    dropdownItemTextDark: {
        color: '#e5e5e5',
    },
    dropdownItemTextSelected: {
        fontWeight: '400',
    },
    categoriesScroll: {
        flexDirection: 'row',
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    categoryChipDark: {
        backgroundColor: '#2a2a2a',
        borderColor: '#3a3a3a',
    },
    categoryChipSelected: {
        backgroundColor: '#1a1a1a',
        borderColor: '#1a1a1a',
    },
    categoryChipSelectedDark: {
        backgroundColor: '#e5e5e5',
        borderColor: '#e5e5e5',
    },
    categoryChipText: {
        fontSize: 14,
        color: '#1a1a1a',
        fontWeight: '300',
    },
    categoryChipTextDark: {
        color: '#e5e5e5',
    },
    categoryChipTextSelected: {
        color: '#ffffff',
        fontWeight: '400',
    },
});