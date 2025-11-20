import { Button } from '@/components/common/Button';
import { InputField } from '@/components/forms/InputField';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Redirigir si no está autenticado
    React.useEffect(() => {
        if (!isAuthenticated) {
            Alert.alert(
                'Acceso Denegado',
                'Debes iniciar sesión para subir imágenes',
                [
                    {
                        text: 'Ir a Login',
                        onPress: () => router.replace('/login'),
                    },
                ]
            );
        }
    }, [isAuthenticated, router]);

    const pickImage = () => {
        // TODO: Implementar selección de imagen
        // Por ahora, simulamos con una imagen de ejemplo
        Alert.alert(
            'Seleccionar Imagen',
            'Aquí implementarás expo-image-picker para seleccionar una imagen',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Imagen de ejemplo
                        setImageUri('https://picsum.photos/800/600?random=' + Date.now());
                    },
                },
            ]
        );
    };

    const handleUpload = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Por favor ingresa un título');
            return;
        }

        if (!imageUri) {
            Alert.alert('Error', 'Por favor selecciona una imagen');
            return;
        }

        setIsLoading(true);
        try {
            // TODO: Implementar la subida real al backend
            // const API_URL = 'http://localhost:3000/api/images/upload';

            // Simulación de subida
            await new Promise((resolve) => setTimeout(resolve, 1500));

            Alert.alert(
                'Éxito',
                'La imagen se ha subido correctamente',
                [
                    {
                        text: 'Ver Galería',
                        onPress: () => router.push('/galeria'),
                    },
                ]
            );

            // Limpiar formulario
            setTitle('');
            setDescription('');
            setImageUri(null);
        } catch {
            Alert.alert('Error', 'No se pudo subir la imagen');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null; // El useEffect redirigirá
    }

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.header, isDark && styles.headerDark]}>
                    <Text style={[styles.title, isDark && styles.titleDark]}>Subir Obra de Arte</Text>
                    <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
                        Comparte tu arte con la comunidad del museo
                    </Text>
                </View>

                <View style={[styles.formContainer, isDark && styles.formContainerDark]}>
                    <TouchableOpacity
                        style={[styles.imagePickerButton, isDark && styles.imagePickerButtonDark]}
                        onPress={pickImage}
                    >
                        {imageUri ? (
                            <Image source={{ uri: imageUri }} style={styles.previewImage} />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <Text style={styles.placeholderIcon}>📷</Text>
                                <Text style={[styles.placeholderText, isDark && styles.placeholderTextDark]}>
                                    Toca para seleccionar una imagen
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <InputField
                        label="Título de la obra"
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Ej: Atardecer en el campo"
                    />

                    <InputField
                        label="Descripción (opcional)"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Describe tu obra..."
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
    scrollContent: {
        padding: 32,
    },
    header: {
        marginBottom: 32,
    },
    headerDark: {
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
        fontSize: 40,
        marginBottom: 12,
        opacity: 0.4,
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
});