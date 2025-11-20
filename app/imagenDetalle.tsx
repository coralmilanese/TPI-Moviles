import { HamburgerMenu } from '@/components/menu/HamburgerMenu';
import { ThemeToggle } from '@/components/menu/ThemeToggle';
import { config } from '@/config/env';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { Comentario, Imagen } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ImagenDetalleScreen() {
    const { effectiveTheme } = useTheme();
    const { user } = useAuth();
    const params = useLocalSearchParams();
    const isDark = effectiveTheme === 'dark';

    const [imagen, setImagen] = useState<Imagen | null>(null);
    const [comentarios, setComentarios] = useState<Comentario[]>([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (params.data) {
            try {
                const decodedData = decodeURIComponent(params.data as string);
                const parsedData = JSON.parse(decodedData);
                setImagen({
                    ...parsedData,
                    url: parsedData.url.replace('http://localhost:4000', config.API_BASE_URL)
                });
                fetchComentarios(parsedData.id);
            } catch (error) {
                console.error('Error parseando datos:', error);
                Alert.alert('Error', 'No se pudo cargar la imagen');
            } finally {
                setIsLoading(false);
            }
        }
    }, [params.data]);

    const fetchComentarios = async (imagenId: number) => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/comentarios/imagen/${imagenId}`);
            if (!response.ok) throw new Error('Error al cargar comentarios');

            const data = await response.json();
            setComentarios(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmitComentario = async () => {
        if (!nuevoComentario.trim()) {
            Alert.alert('Error', 'El comentario no puede estar vacío');
            return;
        }

        if (nuevoComentario.length > 250) {
            Alert.alert('Error', 'El comentario no puede superar los 250 caracteres');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch(`${config.API_BASE_URL}/api/comentarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imagen_id: imagen?.id,
                    usuario_id: user?.id || null,
                    contenido: nuevoComentario,
                }),
            });

            if (!response.ok) throw new Error('Error al enviar comentario');

            Alert.alert(
                'Comentario enviado',
                'Tu comentario está pendiente de aprobación por un administrador',
                [{ text: 'OK' }]
            );

            setNuevoComentario('');
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'No se pudo enviar el comentario');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={isDark ? '#e5e5e5' : '#1a1a1a'} />
                </View>
            </SafeAreaView>
        );
    }

    if (!imagen) {
        return (
            <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
                <View style={styles.centerContent}>
                    <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
                        No se pudo cargar la imagen
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]} edges={['top']}>
            <View style={[styles.header, isDark && styles.headerDark]}>
                <HamburgerMenu />
                <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Detalle</Text>
                <ThemeToggle />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Image
                        source={{ uri: imagen.url }}
                        style={styles.image}
                        resizeMode="contain"
                    />

                    <View style={[styles.infoSection, isDark && styles.infoSectionDark]}>
                        <Text style={[styles.titulo, isDark && styles.tituloDark]}>{imagen.titulo}</Text>
                        <Text style={[styles.autor, isDark && styles.autorDark]}>{imagen.autor}</Text>
                        <Text style={[styles.categoria, isDark && styles.categoriaDark]}>
                            {imagen.categoria}
                        </Text>

                        {imagen.descripcion && (
                            <Text style={[styles.descripcion, isDark && styles.descripcionDark]}>
                                {imagen.descripcion}
                            </Text>
                        )}

                        {imagen.fecha_publicacion && (
                            <Text style={[styles.fecha, isDark && styles.fechaDark]}>
                                {formatDate(imagen.fecha_publicacion)}
                            </Text>
                        )}

                        {imagen.palabras_clave && (
                            <View style={styles.tagsContainer}>
                                {imagen.palabras_clave.split(',').map((tag, index) => (
                                    <View key={index} style={[styles.tag, isDark && styles.tagDark]}>
                                        <Text style={[styles.tagText, isDark && styles.tagTextDark]}>
                                            {tag.trim()}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={[styles.comentariosSection, isDark && styles.comentariosSectionDark]}>
                        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                            Comentarios ({comentarios.length})
                        </Text>

                        {comentarios.map((comentario) => (
                            <View key={comentario.id} style={[styles.comentario, isDark && styles.comentarioDark]}>
                                <Text style={[styles.comentarioUsuario, isDark && styles.comentarioUsuarioDark]}>
                                    {comentario.usuario || 'Anónimo'}
                                </Text>
                                <Text style={[styles.comentarioTexto, isDark && styles.comentarioTextoDark]}>
                                    {comentario.contenido}
                                </Text>
                                <Text style={[styles.comentarioFecha, isDark && styles.comentarioFechaDark]}>
                                    {formatDate(comentario.creado_en)}
                                </Text>
                            </View>
                        ))}

                        {comentarios.length === 0 && (
                            <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
                                No hay comentarios aún. ¡Sé el primero en comentar!
                            </Text>
                        )}
                    </View>

                    <View style={[styles.inputSection, isDark && styles.inputSectionDark]}>
                        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
                            Dejar un comentario
                        </Text>
                        <TextInput
                            style={[styles.input, isDark && styles.inputDark]}
                            placeholder="Escribe tu comentario (máx. 250 caracteres)"
                            placeholderTextColor={isDark ? '#666' : '#999'}
                            value={nuevoComentario}
                            onChangeText={setNuevoComentario}
                            multiline
                            maxLength={250}
                            editable={!isSubmitting}
                        />
                        <Text style={[styles.charCount, isDark && styles.charCountDark]}>
                            {nuevoComentario.length}/250
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                isDark && styles.submitButtonDark,
                                isSubmitting && styles.submitButtonDisabled
                            ]}
                            onPress={handleSubmitComentario}
                            disabled={isSubmitting}
                        >
                            <Text style={styles.submitButtonText}>
                                {isSubmitting ? 'Enviando...' : 'Enviar comentario'}
                            </Text>
                        </TouchableOpacity>
                        <Text style={[styles.noteText, isDark && styles.noteTextDark]}>
                            Los comentarios serán revisados antes de publicarse
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        paddingBottom: 40,
    },
    image: {
        width: '100%',
        height: 400,
        backgroundColor: '#f0f0f0',
    },
    infoSection: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    infoSectionDark: {
        backgroundColor: '#1a1a1a',
        borderBottomColor: '#2a2a2a',
    },
    titulo: {
        fontSize: 24,
        fontWeight: '400',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    tituloDark: {
        color: '#e5e5e5',
    },
    autor: {
        fontSize: 18,
        fontWeight: '300',
        color: '#666',
        marginBottom: 6,
    },
    autorDark: {
        color: '#999',
    },
    categoria: {
        fontSize: 14,
        fontWeight: '300',
        color: '#999',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    categoriaDark: {
        color: '#666',
    },
    descripcion: {
        fontSize: 15,
        fontWeight: '300',
        color: '#333',
        lineHeight: 22,
        marginBottom: 12,
    },
    descripcionDark: {
        color: '#ccc',
    },
    fecha: {
        fontSize: 12,
        fontWeight: '300',
        color: '#999',
        marginBottom: 12,
    },
    fechaDark: {
        color: '#666',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    tag: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    tagDark: {
        backgroundColor: '#2a2a2a',
    },
    tagText: {
        fontSize: 12,
        fontWeight: '300',
        color: '#666',
    },
    tagTextDark: {
        color: '#999',
    },
    comentariosSection: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    comentariosSectionDark: {
        backgroundColor: '#1a1a1a',
        borderBottomColor: '#2a2a2a',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '400',
        color: '#1a1a1a',
        marginBottom: 16,
    },
    sectionTitleDark: {
        color: '#e5e5e5',
    },
    comentario: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    comentarioDark: {
        backgroundColor: '#0f0f0f',
        borderColor: '#2a2a2a',
    },
    comentarioUsuario: {
        fontSize: 14,
        fontWeight: '400',
        color: '#1a1a1a',
        marginBottom: 6,
    },
    comentarioUsuarioDark: {
        color: '#e5e5e5',
    },
    comentarioTexto: {
        fontSize: 14,
        fontWeight: '300',
        color: '#333',
        lineHeight: 20,
        marginBottom: 8,
    },
    comentarioTextoDark: {
        color: '#ccc',
    },
    comentarioFecha: {
        fontSize: 11,
        fontWeight: '300',
        color: '#999',
    },
    comentarioFechaDark: {
        color: '#666',
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '300',
        color: '#999',
        textAlign: 'center',
        paddingVertical: 20,
    },
    emptyTextDark: {
        color: '#666',
    },
    inputSection: {
        padding: 20,
        backgroundColor: '#fff',
    },
    inputSectionDark: {
        backgroundColor: '#1a1a1a',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 16,
        fontSize: 14,
        fontWeight: '300',
        color: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    inputDark: {
        backgroundColor: '#0f0f0f',
        borderColor: '#2a2a2a',
        color: '#e5e5e5',
    },
    charCount: {
        fontSize: 12,
        fontWeight: '300',
        color: '#999',
        textAlign: 'right',
        marginTop: 6,
        marginBottom: 12,
    },
    charCountDark: {
        color: '#666',
    },
    submitButton: {
        backgroundColor: '#1a1a1a',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonDark: {
        backgroundColor: '#e5e5e5',
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '400',
    },
    noteText: {
        fontSize: 12,
        fontWeight: '300',
        color: '#999',
        textAlign: 'center',
        marginTop: 12,
    },
    noteTextDark: {
        color: '#666',
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 14,
        color: '#d32f2f',
        fontWeight: '300',
    },
    errorTextDark: {
        color: '#f44336',
    },
});
