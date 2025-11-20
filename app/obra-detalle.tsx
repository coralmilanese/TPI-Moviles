import { HamburgerMenu } from '@/components/menu/HamburgerMenu';
import { ThemeToggle } from '@/components/menu/ThemeToggle';
import { config } from '@/config/env';
import { useTheme } from '@/contexts/ThemeContext';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ObraDetalle {
    id: number;
    titulo: string;
    descripcion: string;
    autor: string;
    categoria: string;
    url: string;
    palabras_clave?: string | string[];
    fecha_publicacion?: string;
}

export default function ObraDetalleScreen() {
    const router = useRouter();
    const { data } = useLocalSearchParams();
    const { effectiveTheme } = useTheme();
    const isDark = effectiveTheme === 'dark';

    const [obra, setObra] = useState<ObraDetalle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (data) {
            processObraData(data as string);
        }
    }, [data]);

    const processObraData = (encodedData: string) => {
        try {
            setLoading(true);
            const decodedData = decodeURIComponent(encodedData);
            const obraData = JSON.parse(decodedData);

            // Reemplazar localhost con la IP en la URL
            const obraWithFixedUrl = {
                ...obraData,
                url: obraData.url.replace('http://localhost:4000', config.API_BASE_URL),
                categoria: obraData.categoria || 'Sin categoría',
                // Convertir palabras_clave si es string
                palabras_clave: typeof obraData.palabras_clave === 'string'
                    ? obraData.palabras_clave.split(',').map((p: string) => p.trim())
                    : obraData.palabras_clave,
            };

            setObra(obraWithFixedUrl);
        } catch (err) {
            console.error('Error processing obra data:', err);
            setError('No se pudo procesar la información de la obra');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
                <View style={[styles.header, isDark && styles.headerDark]}>
                    <HamburgerMenu />
                    <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Detalle de Obra</Text>
                    <ThemeToggle />
                </View>
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={isDark ? '#e5e5e5' : '#1a1a1a'} />
                    <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
                        Cargando información...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !obra) {
        return (
            <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
                <View style={[styles.header, isDark && styles.headerDark]}>
                    <HamburgerMenu />
                    <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Detalle de Obra</Text>
                    <ThemeToggle />
                </View>
                <View style={styles.centerContent}>
                    <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
                        {error || 'Obra no encontrada'}
                    </Text>
                    <TouchableOpacity
                        style={[styles.button, isDark && styles.buttonDark]}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>Volver</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
            <View style={[styles.header, isDark && styles.headerDark]}>
                <HamburgerMenu />
                <Text style={[styles.headerTitle, isDark && styles.headerTitleDark]}>Detalle de Obra</Text>
                <ThemeToggle />
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: obra.url }}
                        style={styles.mainImage}
                        contentFit="cover"
                    />
                </View>

                <View style={styles.contentContainer}>
                    <Text style={[styles.title, isDark && styles.titleDark]}>{obra.titulo}</Text>

                    <View style={[styles.metaRow, isDark && styles.metaRowDark]}>
                        <View style={styles.metaItem}>
                            <Text style={[styles.metaLabel, isDark && styles.metaLabelDark]}>Autor</Text>
                            <Text style={[styles.metaValue, isDark && styles.metaValueDark]}>{obra.autor}</Text>
                        </View>

                        <View style={styles.metaItem}>
                            <Text style={[styles.metaLabel, isDark && styles.metaLabelDark]}>Categoría</Text>
                            <Text style={[styles.metaValue, isDark && styles.metaValueDark]}>{obra.categoria}</Text>
                        </View>
                    </View>

                    {obra.fecha_publicacion && (
                        <View style={styles.metaItem}>
                            <Text style={[styles.metaLabel, isDark && styles.metaLabelDark]}>Fecha de publicación</Text>
                            <Text style={[styles.metaValue, isDark && styles.metaValueDark]}>
                                {new Date(obra.fecha_publicacion).toLocaleDateString('es-AR')}
                            </Text>
                        </View>
                    )}

                    <View style={[styles.section, isDark && styles.sectionDark]}>
                        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Descripción</Text>
                        <Text style={[styles.description, isDark && styles.descriptionDark]}>
                            {obra.descripcion || 'Sin descripción disponible'}
                        </Text>
                    </View>

                    {obra.palabras_clave && Array.isArray(obra.palabras_clave) && obra.palabras_clave.length > 0 && (
                        <View style={[styles.section, isDark && styles.sectionDark]}>
                            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Palabras clave</Text>
                            <View style={styles.tagsContainer}>
                                {obra.palabras_clave.map((palabra, index) => (
                                    <View key={index} style={[styles.tag, isDark && styles.tagDark]}>
                                        <Text style={[styles.tagText, isDark && styles.tagTextDark]}>{palabra}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.backButton, isDark && styles.backButtonDark]}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.backButtonText, isDark && styles.backButtonTextDark]}>
                            ← Volver
                        </Text>
                    </TouchableOpacity>
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
    },
    headerDark: {
        backgroundColor: 'transparent',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '300',
        color: '#1a1a1a',
        letterSpacing: 0.5,
    },
    headerTitleDark: {
        color: '#e5e5e5',
    },
    scrollView: {
        flex: 1,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 15,
        color: '#666',
        fontWeight: '300',
    },
    loadingTextDark: {
        color: '#999',
    },
    errorText: {
        fontSize: 16,
        color: '#e74c3c',
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '300',
    },
    errorTextDark: {
        color: '#ff6b6b',
    },
    button: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
    },
    buttonDark: {
        backgroundColor: '#e5e5e5',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '400',
    },
    buttonTextDark: {
        color: '#1a1a1a',
    },
    imageContainer: {
        width: '100%',
        height: 400,
        backgroundColor: '#000',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '300',
        color: '#1a1a1a',
        marginBottom: 20,
        letterSpacing: 0.5,
    },
    titleDark: {
        color: '#e5e5e5',
    },
    metaRow: {
        flexDirection: 'row',
        gap: 24,
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    metaRowDark: {
        borderBottomColor: '#2a2a2a',
    },
    metaItem: {
        flex: 1,
    },
    metaLabel: {
        fontSize: 12,
        color: '#757575',
        fontWeight: '400',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    metaLabelDark: {
        color: '#999',
    },
    metaValue: {
        fontSize: 15,
        color: '#1a1a1a',
        fontWeight: '300',
    },
    metaValueDark: {
        color: '#e5e5e5',
    },
    section: {
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
    },
    sectionDark: {
        borderTopColor: '#2a2a2a',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: '#1a1a1a',
        marginBottom: 12,
        letterSpacing: 0.3,
    },
    sectionTitleDark: {
        color: '#e5e5e5',
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: '#666',
        fontWeight: '300',
    },
    descriptionDark: {
        color: '#999',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
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
        fontSize: 13,
        color: '#666',
        fontWeight: '300',
    },
    tagTextDark: {
        color: '#999',
    },
    backButton: {
        marginTop: 32,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1a1a1a',
        alignItems: 'center',
    },
    backButtonDark: {
        borderColor: '#e5e5e5',
    },
    backButtonText: {
        fontSize: 15,
        color: '#1a1a1a',
        fontWeight: '300',
    },
    backButtonTextDark: {
        color: '#e5e5e5',
    },
});
